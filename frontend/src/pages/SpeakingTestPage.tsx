import React, { useEffect, useRef, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { convertToWav } from "@utils/audioUtils";
// 유사도 측정 도구
import _ from "lodash";
import stringSimilarity from "string-similarity";
// Components
import SpeakingTestReference from "@components/testpage/SpeakingTestReference";
import SpeakingTestRealtimeText from "@components/testpage/SpeakingTestRealtimeText";
import SpeakingTestRecord from "@components/testpage/SpeakingTestRecord";
// 이외 라이브러리
import { useSetRecoilState } from "recoil";
import locationState from "@store/locationState";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const SpeakingTestPage: React.FC = () => {
  const navigate = useNavigate();

  // 페이지 확인
  const setCurrentLocation = useSetRecoilState(locationState);
  useEffect(() => {
    setCurrentLocation("Speaking Test Page");
  });

  const [recognizingText, setRecognizingText] = useState<string>(""); // 실시간 텍스트
  const [, setRecognitionResult] = useState<string>(""); // 최종 텍스트
  const [audioUrl, setAudioUrl] = useState<string | undefined>("");
  const recognizerRef = useRef<sdk.SpeechRecognizer | null>(null);
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    import.meta.env.VITE_SPEECH_API_KEY,
    import.meta.env.VITE_SPEECH_REGION
  );

  // 점수 측정용 변수
  const [, setAveragePronunciationScore] = useState<number | null>(null);
  const [, setAverageAccuracyScore] = useState<number | null>(null);
  const [, setAverageFluencyScore] = useState<number | null>(null);
  const [, setAverageProsodyScore] = useState<number | null>(null);
  const [, setCompletenessScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [, setAudioFile] = useState<File | null>(null);

  // 점수 저장용 배열
  const pronunciationScores: number[] = [];
  const accuracyScores: number[] = [];
  const fluencyScores: number[] = [];
  const prosodyScores: number[] = [];

  const recognizedTexts: string[] = []; // 인식된 텍스트들을 저장

  // 이하 Realtime Speech To Text
  const [userRecognizedText, setUserRecognizedText] = useState("");
  const [, setUserRecognizingText] = useState("");
  // 스피킹 테스트 시작
  const [, setIsRecording] = useState(false);
  const [isExplainText, setIsExplainText] = useState(true);

  // 녹음이 진행 중이거나 완료된 경우에만 제출 버튼이 활성화되도록 설정
  const isSubmitDisabled = !audioUrl || isLoading;

  speechConfig.speechRecognitionLanguage = "en-US";

  const startRecognition = () => {
    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
    recognizerRef.current = recognizer;

    recognizer.recognizing = (_, e) => {
      // 실시간 인식된 텍스트 업데이트
      setRecognizingText(e.result.text);
      setUserRecognizingText(e.result.text); // 이 부분이 실시간으로 반영됨
    };

    recognizer.recognized = (_, e) => {
      if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
        setUserRecognizedText((prevText) => prevText + " " + e.result.text);
        setUserRecognizingText("");
      }
    };

    recognizer.canceled = (_, e) => {
      console.error(`Recognition canceled: ${e.reason}`);
    };

    recognizer.startContinuousRecognitionAsync();
    setIsRecording(true);
    setIsExplainText(false);
  };

  const stopRecognition = () => {
    if (recognizerRef.current) {
      recognizerRef.current.stopContinuousRecognitionAsync(() => {
        setIsRecording(false);
        console.log("Recognition stopped");
      });
    }
  };

  // 예제 문장 (나중에 Back에서 받아서 출력할 문구)
  const reference_text =
    "Today was a beautiful day. We had a great time taking a long walk outside in the morning. The sun was shining brightly, and a gentle breeze made the weather feel perfect. As we strolled through the park, we noticed the trees swaying softly, and the sound of birds chirping filled the air.";

  const reference_text_translate =
    "오늘은 정말 아름다운 날이었어. 우리는 아침에 긴 산책을 하며 즐거운 시간을 보냈어. 해가 밝게 빛나고, 부드러운 바람이 날씨를 완벽하게 만들어줬어. 공원을 걷다가 나무들이 부드럽게 흔들리는 것을 봤고, 새들이 지저귀는 소리가 공기를 가득 채웠어.";

  // react-media-recorder 녹음 관리
  const { startRecording, stopRecording, mediaBlobUrl, status } =
    useReactMediaRecorder({ audio: true });

  const startUserRecording = () => {
    setUserRecognizedText("");
    setRecognizingText("");
    startRecording();
    startRecognition();
  };

  const stopUserRecording = () => {
    stopRecording();
    stopRecognition();
  };

  useEffect(() => {
    setAudioUrl(mediaBlobUrl);
  }, [mediaBlobUrl]);

  const restartRecording = () => {
    setRecognizingText("");
    setUserRecognizedText("");
    setAudioUrl("");
    stopUserRecording();
    startUserRecording();
  };

  const handleRecordingDataSubmit = async () => {
    if (!mediaBlobUrl) return;

    setIsLoading(true); // 로딩 시작

    const response = await fetch(mediaBlobUrl);
    const webmBlob = await response.blob();

    const wavBlob = await convertToWav(webmBlob);

    const audioFile = new File([wavBlob], "recorded_audio.wav", {
      type: "audio/wav",
    });

    setAudioFile(audioFile);

    const audioConfig = sdk.AudioConfig.fromWavFileInput(audioFile);

    const pronunciationAssessmentConfig = new sdk.PronunciationAssessmentConfig(
      reference_text,
      sdk.PronunciationAssessmentGradingSystem.HundredMark,
      sdk.PronunciationAssessmentGranularity.Phoneme,
      true
    );
    pronunciationAssessmentConfig.enableProsodyAssessment = true;

    speechConfig.speechRecognitionLanguage = "en-US";

    const reco = new sdk.SpeechRecognizer(speechConfig, audioConfig);
    pronunciationAssessmentConfig.applyTo(reco);

    reco.recognized = (_, e) => {
      if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
        console.log(`Final recognized text: ${e.result.text}`);

        const pronunciationResult =
          sdk.PronunciationAssessmentResult.fromResult(e.result);

        if (pronunciationResult) {
          // 각 점수를 배열에 저장
          pronunciationScores.push(pronunciationResult.pronunciationScore);
          accuracyScores.push(pronunciationResult.accuracyScore);
          fluencyScores.push(pronunciationResult.fluencyScore);
          prosodyScores.push(pronunciationResult.prosodyScore);

          // 인식된 텍스트를 저장
          recognizedTexts.push(e.result.text);

          // 최종 인식된 텍스트로 업데이트
          setRecognitionResult(
            (prevResult) => prevResult + " " + e.result.text
          );
          setRecognizingText(""); // 인식이 완료되면 실시간 텍스트는 지우기
        } else {
          console.error("Pronunciation assessment failed.");
        }
        // 인식 불가 혹은 많이 다를 때
      } else if (e.result.reason === sdk.ResultReason.NoMatch) {
        console.log("No speech could be recognized.");
        alert("No speech was recognized. Please try again.");
        // 오류 이후 행동
        setAudioFile(null);
        setAveragePronunciationScore(null);
        setCompletenessScore(null);
      }
    };
    // 에러 코드 반환
    reco.canceled = (_, e) => {
      if (e.reason === sdk.CancellationReason.Error) {
        console.error("Error: ", e.errorDetails);
      }
      setIsLoading(false);
    };

    reco.sessionStopped = () => {
      // 인식이 끝나면 각 점수의 평균을 계산
      const avgPronunciation = _.mean(pronunciationScores).toFixed(1);
      const avgAccuracy = _.mean(accuracyScores).toFixed(1);
      const avgFluency = _.mean(fluencyScores).toFixed(1);
      const avgProsody = _.mean(prosodyScores).toFixed(1);

      // 평균 점수 상태 업데이트
      setAveragePronunciationScore(Number(avgPronunciation));
      setAverageAccuracyScore(Number(avgAccuracy));
      setAverageFluencyScore(Number(avgFluency));
      setAverageProsodyScore(Number(avgProsody));

      // completenessScore 계산
      const recognizedTextJoined = recognizedTexts.join(" ").toLowerCase();

      const similarity = stringSimilarity.compareTwoStrings(
        reference_text.toLowerCase(),
        recognizedTextJoined
      );

      const completeness = (similarity * 100).toFixed(1);
      setCompletenessScore(Number(completeness));
      console.log("Completeness Score:", completeness);
      // TODO : 이후 최종 결과를 Back에 저장 api 보내고 Result 페이지로 이동하는 로직 필요
      const results = {
        pronunciationScore: avgPronunciation,
        accuracyScore: avgAccuracy,
        fluencyScore: avgFluency,
        prosodyScore: avgProsody,
        completenessScore: completeness,
      };
      setIsLoading(false);
      console.log(results);
      navigate("/speakresult");
    };

    reco.startContinuousRecognitionAsync(
      () => {
        console.log("Recognition started");
      },
      (err) => {
        console.error("Error starting recognition:", err);
        setIsLoading(false);
      }
    );
  };

  return (
    <>
      <MainContainer>
        <MainLayout>
          <SpeakingTestReference
            referenceTest={reference_text}
            referenceTextTranslate={reference_text_translate}
          />
          <SubArea>
            <SubContainer>
              <SpeakingTestRealtimeText
                isExplainText={isExplainText}
                userRecognizedText={userRecognizedText}
                userRecognizingText={recognizingText}
                status={status}
              />
            </SubContainer>

            <SubContainer>
              <SpeakingTestRecord
                startUserRecording={startUserRecording}
                stopUserRecording={stopUserRecording}
                restartRecording={restartRecording}
                audioUrl={audioUrl}
                status={status}
              />
            </SubContainer>
          </SubArea>
        </MainLayout>
        <SubmitButtonContainer>
          <SubmitButton
            onClick={handleRecordingDataSubmit}
            disabled={isSubmitDisabled}
          >
            {isLoading ? "제출중일 경우 문구" : "제출하기"}
          </SubmitButton>
        </SubmitButtonContainer>
      </MainContainer>
    </>
  );
};

const MainContainer = styled.div`
  width: 90%;
  min-height: 50rem;
  margin: auto;
  padding: 0.625rem;
  background-color: ${(props) => props.theme.colors.cardBackground + "BF"};
  backdrop-filter: blur(0.25rem);
  border-radius: 0.75rem;
  box-shadow: 0.5rem 0.5rem 0.25rem ${(props) => props.theme.colors.shadow};
  transition: box-shadow 0.5s;
`;

const MainLayout = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SubArea = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
`;

const SubContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 90%;
  min-height: 15rem;
  margin: 0.75rem 0;
  padding: 0.625rem;
  background-color: ${(props) => props.theme.colors.cardBackground + "BF"};
  backdrop-filter: blur(0.25rem);
  border-radius: 0.75rem;
  box-shadow: 0.5rem 0.5rem 0.25rem ${(props) => props.theme.colors.shadow};
  transition: box-shadow 0.5s;
`;

const SubmitButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
`;

const SubmitButton = styled.button<{ disabled: boolean }>`
  padding: 1rem 2rem;
  background-color: ${(props) =>
    props.disabled ? "#ccc" : props.theme.colors.primary};
  color: ${(props) => (props.disabled ? "#666" : "#fff")};
  border: none;
  border-radius: 0.625rem;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) =>
      props.disabled ? "#ccc" : props.theme.colors.primaryHover};
  }
`;

export default SpeakingTestPage;

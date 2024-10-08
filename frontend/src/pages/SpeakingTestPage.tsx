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
import Modal from "@components/Modal";
import Spinner from "@components/Spinner";
import HeaderMobile from "@components/common/HeaderMobile";
// 이외 라이브러리
import { useSetRecoilState } from "recoil";
import locationState from "@store/locationState";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
// 데이터 호출 라이브러리
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getPronounceTestList,
  postPronounceTestResult,
  PronounceTestRequestDto,
  PronounceTestListDto,
} from "@services/speakingTestService";
import { isExpModalState } from "@store/expState";
import { useMediaQuery } from "react-responsive"; // 모바일 여부 감지
import SpeakingTestRealtimeTextMobile from "@components/testpage/SpeakingTestRealtimeTextMobile";

const SpeakingTestPage: React.FC = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const setExpModal = useSetRecoilState(isExpModalState);
  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery({
    queryKey: ["pronounceTestData"],
    queryFn: () => getPronounceTestList(),
    refetchOnWindowFocus: false,
  });

  // 예문
  const [referenceText, setReferenceText] = useState<string>("");
  const [referenceTextTranslate, setReferenceTextTranslate] =
    useState<string>("");

  useEffect(() => {
    if (data) {
      // 예문을 합치는 과정 (문장 평가)
      const text = data
        .map((item: PronounceTestListDto) =>
          item.sentence.trim().replace(/\.$/, "")
        )
        .join(". ");
      const translatedText = data
        .map((item: PronounceTestListDto) =>
          item.sentenceMeaning.trim().replace(/\.$/, "")
        )
        .join(". ");

      // 백엔드에서 받은 문장의 ID 배열을 상태로 저장
      const ids = data.map((item: PronounceTestListDto) => item.sentenceId);
      setSentenceIds(ids);

      setReferenceText(text);
      setReferenceTextTranslate(translatedText);
    }
  }, [data]);

  // 제출 모달
  const [isSubmitModal, setIsSubmitModal] = useState<boolean>(false);
  const submitModal = () => setIsSubmitModal(true);
  const closeSubmitModal = () => setIsSubmitModal(false);
  const handleRecordingDataSubmit = () => {
    submitModal();
  };

  // 녹음 시작 모달
  const [isStartRecordModal, setIsStartRecordModal] = useState(false);
  const startRecordingModal = () => setIsStartRecordModal(true);
  const closeRecordingModal = () => setIsStartRecordModal(false);

  // 페이지 확인
  const setCurrentLocation = useSetRecoilState(locationState);
  useEffect(() => {
    setCurrentLocation("Speaking Test Page");
  }, [setCurrentLocation]);

  // 컴포넌트가 언마운트될 때 정리
  useEffect(() => {
    return () => {
      if (recognizerRef.current) {
        recognizerRef.current.stopContinuousRecognitionAsync();
      }
    };
  }, []);

  const [recognizingText, setRecognizingText] = useState<string>(""); // 실시간 텍스트
  const [audioUrl, setAudioUrl] = useState<string | undefined>("");
  const recognizerRef = useRef<sdk.SpeechRecognizer | null>(null);
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    import.meta.env.VITE_SPEECH_API_KEY,
    import.meta.env.VITE_SPEECH_REGION
  );

  // sentenceIds 저장
  const [sentenceIds, setSentenceIds] = useState<number[]>([]);

  // 점수 측정용 변수
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

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
  const isSubmitDisabled = !audioUrl || isSubmitLoading;

  speechConfig.speechRecognitionLanguage = "en-US";

  const mutation = useMutation({
    mutationFn: (testResult: PronounceTestRequestDto) =>
      postPronounceTestResult(testResult),
    onSuccess: (data) => {
      const { audioFileId } = data; // 응답에서 audioFileId 추출
      // audioFileId를 결과 페이지로 전달
      navigate(`/speaking/result/${audioFileId}`);
    },
    onError: (mutationError) => {
      console.error("저장 에러", mutationError);
    },
  });

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
  const handleScrollToTop = () => {
    // 화면을 가장 위로 스크롤
    window.scrollTo({
      top: 0,
      behavior: "smooth", // 부드럽게 스크롤
    });
  };
  // react-media-recorder 녹음 관리
  const { startRecording, stopRecording, mediaBlobUrl, status } =
    useReactMediaRecorder({ audio: true });

  const startUserRecording = () => {
    setUserRecognizedText("");
    setRecognizingText("");
    startRecording();
    startRecognition();
    handleScrollToTop();
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

  const handleSubmitConfirm = async () => {
    setIsSubmitModal(false);
    if (!mediaBlobUrl) return;

    setIsSubmitLoading(true); // 로딩 시작

    const response = await fetch(mediaBlobUrl);
    const webmBlob = await response.blob();

    const wavBlob = await convertToWav(webmBlob);

    const audioFile = new File([wavBlob], "recorded_audio.wav", {
      type: "audio/wav",
    });

    const audioConfig = sdk.AudioConfig.fromWavFileInput(audioFile);

    const pronunciationAssessmentConfig = new sdk.PronunciationAssessmentConfig(
      referenceText,
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
          console.log(
            "중간점수",
            pronunciationScores,
            accuracyScores,
            fluencyScores,
            prosodyScores
          );

          // 인식된 텍스트를 저장
          recognizedTexts.push(e.result.text);

          setRecognizingText(""); // 인식이 완료되면 실시간 텍스트는 지우기
        } else {
          console.error("Pronunciation assessment failed.");
        }
        // 인식 불가 혹은 많이 다를 때
      } else if (e.result.reason === sdk.ResultReason.NoMatch) {
        console.log("No speech could be recognized.");
        alert("인식할 수 없는 음성입니다. 소음을 최소화 해주세요!");
      }
    };
    // 에러 코드 반환
    reco.canceled = (_, e) => {
      if (e.reason === sdk.CancellationReason.Error) {
        console.error("Error: ", e.errorDetails);
      }
      setIsSubmitLoading(false);
    };

    reco.sessionStopped = () => {
      // 인식이 끝나면 각 점수의 평균을 계산 (정수)
      const avgPronunciation = _.mean(pronunciationScores).toFixed(0);
      const avgAccuracy = _.mean(accuracyScores).toFixed(0);
      const avgFluency = _.mean(fluencyScores).toFixed(0);
      const avgProsody = _.mean(prosodyScores).toFixed(0);

      // completenessScore 계산
      const recognizedTextJoined = recognizedTexts.join(" ").toLowerCase();

      const similarity = stringSimilarity.compareTwoStrings(
        referenceText.toLowerCase(),
        recognizedTextJoined
      );

      const completeness = (similarity * 100).toFixed(0);

      const results = {
        sentenceIds: sentenceIds,
        accuracyScore: Number(avgAccuracy),
        fluencyScore: Number(avgFluency),
        completenessScore: Number(completeness),
        prosodyScore: Number(avgProsody),
        totalScore: Number(avgPronunciation),
        files: audioFile,
      };

      mutation.mutate(results, {
        onSuccess: () => {
          setExpModal({
            isOpen: true,
            experience: 20,
            action: "예문 스피킹 테스트  ",
          });
        },
      });
      setIsSubmitLoading(false);
    };

    reco.startContinuousRecognitionAsync(
      () => {
        console.log("Recognition started");
      },
      (err) => {
        console.error("Error starting recognition:", err);
        setIsSubmitLoading(false);
      }
    );
  };

  if (isMobile) {
    return (
      <>
        <HeaderMobile title="Pronounce Test" url="/speakingtesthistory" />
        <MobileContainer>
          <SpeakingTestReference
            referenceTest={referenceText}
            referenceTextTranslate={referenceTextTranslate}
          />
          <SpeakingTestRealtimeTextMobile
            isExplainText={isExplainText}
            userRecognizedText={userRecognizedText}
            userRecognizingText={recognizingText}
            status={status}
          />
          <SpeakingTestRecord
            startUserRecording={startUserRecording}
            stopUserRecording={stopUserRecording}
            restartRecording={restartRecording}
            audioUrl={audioUrl}
            status={status}
            isStartRecordModal={isStartRecordModal}
            startRecordingModal={startRecordingModal}
            closeRecordingModal={closeRecordingModal}
          />
          <SubmitButtonContainer>
            <SubmitButton
              onClick={handleRecordingDataSubmit}
              disabled={isSubmitDisabled || !userRecognizedText}
            >
              {isSubmitLoading ? <Spinner></Spinner> : "제출하기"}
            </SubmitButton>
          </SubmitButtonContainer>
        </MobileContainer>
        <Modal
          isOpen={isSubmitModal}
          onClose={closeSubmitModal}
          title="Speaking Test"
        >
          <p>정말로 제출하시겠습니까?</p>
          <ModalButtonContainer>
            <ModalCancelButton onClick={closeSubmitModal}>
              취소
            </ModalCancelButton>
            <ModalConfirmButton onClick={handleSubmitConfirm}>
              확인
            </ModalConfirmButton>
          </ModalButtonContainer>
        </Modal>
      </>
    );
  }

  return (
    <>
      <MainContainer>
        <MainLayout>
          {isLoading ? (
            <Spinner />
          ) : error ? (
            <ErrorText>에러가 발생했습니다. 다시 시도해 주세요.</ErrorText>
          ) : (
            <SpeakingTestReference
              referenceTest={referenceText}
              referenceTextTranslate={referenceTextTranslate}
            />
          )}
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
                isStartRecordModal={isStartRecordModal}
                startRecordingModal={startRecordingModal}
                closeRecordingModal={closeRecordingModal}
              />
            </SubContainer>
          </SubArea>
        </MainLayout>
        <SubmitButtonContainer>
          <SubmitButton
            onClick={handleRecordingDataSubmit}
            disabled={isSubmitDisabled || !userRecognizedText}
          >
            {isSubmitLoading ? <Spinner></Spinner> : "제출하기"}
          </SubmitButton>
        </SubmitButtonContainer>
        <Modal
          isOpen={isSubmitModal}
          onClose={closeSubmitModal}
          title="Speaking Test"
        >
          <p>정말로 제출하시겠습니까?</p>
          <ModalButtonContainer>
            <ModalCancelButton onClick={closeSubmitModal}>
              취소
            </ModalCancelButton>
            <ModalConfirmButton onClick={handleSubmitConfirm}>
              확인
            </ModalConfirmButton>
          </ModalButtonContainer>
        </Modal>
      </MainContainer>
    </>
  );
};

export default SpeakingTestPage;

const MainContainer = styled.div`
  width: 90%;
  min-height: 45rem;
  margin: auto;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: ${(props) => props.theme.colors.cardBackground + "5A"};
  backdrop-filter: blur(0.25rem);
  border-radius: 0.75rem;
  box-shadow: ${(props) => props.theme.shadows.medium};
  transition: box-shadow 0.5s;
`;

const MainLayout = styled.div`
  margin-top: 4rem;
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
  min-height: 20rem;
  margin: 0.75rem 0;
  padding: 0.625rem;
  background-color: ${(props) => props.theme.colors.cardBackground + "5A"};
  backdrop-filter: blur(0.25rem);
  border-radius: 0.75rem;
  box-shadow: ${(props) => props.theme.shadows.medium};
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
  margin-bottom: 1rem;
  background-color: ${(props) =>
    props.disabled
      ? props.theme.colors.placeholder
      : props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0.625rem;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) =>
      props.disabled ? "#ccc" : props.theme.colors.primaryPress};
  }
`;

const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 2rem;
`;

const ModalCancelButton = styled.button`
  padding: 0.5rem 1.5rem;
  background-color: ${(props) => props.theme.colors.placeholder};
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.colors.danger};
  }
`;
const ModalConfirmButton = styled.button`
  padding: 0.5rem 1.5rem;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }
`;

const ErrorText = styled.div`
  color: ${(props) => props.theme.colors.danger};
  font-size: 1.25rem;
  text-align: center;
`;

const MobileContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding-bottom: 5rem;
`;

import React, { useEffect, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
// 유사도 측정 도구
import _ from "lodash";
import stringSimilarity from "string-similarity";
import { useSetRecoilState } from "recoil";
import locationState from "@store/state";

const SpeakingTestPage: React.FC = () => {
  const [recognizingText, setRecognizingText] = useState<string>(""); // 실시간 인식 텍스트
  const [recognitionResult, setRecognitionResult] = useState<string>(""); // 최종 인식 텍스트

  const speechConfig = sdk.SpeechConfig.fromSubscription(
    import.meta.env.VITE_SPEECH_API_KEY,
    import.meta.env.VITE_SPEECH_REGION
  );

  const [averagePronunciationScore, setAveragePronunciationScore] = useState<
    number | null
  >(null);
  const [averageAccuracyScore, setAverageAccuracyScore] = useState<
    number | null
  >(null);
  const [averageFluencyScore, setAverageFluencyScore] = useState<number | null>(
    null
  );
  const [averageProsodyScore, setAverageProsodyScore] = useState<number | null>(
    null
  );
  const [completenessScore, setCompletenessScore] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [, setAudioFile] = useState<File | null>(null);

  // 점수 저장용 배열
  const pronunciationScores: number[] = [];
  const accuracyScores: number[] = [];
  const fluencyScores: number[] = [];
  const prosodyScores: number[] = [];

  const recognizedTexts: string[] = []; // 인식된 텍스트들을 저장

  // 예제 문장 (나중에 Back에서 받아서 출력할 문구)
  const reference_text =
    "Today was a beautiful day. We had a great time taking a long walk outside in the morning. The sun was shining brightly, and a gentle breeze made the weather feel perfect. As we strolled through the park, we noticed the trees swaying softly, and the sound of birds chirping filled the air.";

  // react-media-recorder 녹음 관리
  const { startRecording, stopRecording, mediaBlobUrl, status } =
    useReactMediaRecorder({ audio: true });

  const handleSubmit = async () => {
    if (!mediaBlobUrl) return;

    setIsLoading(true); // 로딩 시작

    // Fetch the webm audio blob from mediaBlobUrl
    const response = await fetch(mediaBlobUrl);
    const webmBlob = await response.blob();

    // WAV 변환 함수 사용
    const convertToWav = async (
      blob: Blob,
      targetSampleRate: number = 16000
    ): Promise<Blob> => {
      return new Promise((resolve) => {
        const audioContext = new (window.AudioContext || window.AudioContext)();

        const reader = new FileReader();
        reader.onload = async (e) => {
          const arrayBuffer = e.target?.result as ArrayBuffer;

          // 원본 오디오 데이터를 AudioBuffer로 디코딩
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

          // 기존 샘플링 레이트
          const originalSampleRate = audioBuffer.sampleRate;
          console.log("Original Sample Rate:", originalSampleRate);

          // 필요한 경우 다운샘플링 진행
          if (originalSampleRate !== targetSampleRate) {
            const offlineContext = new OfflineAudioContext(
              audioBuffer.numberOfChannels,
              audioBuffer.duration * targetSampleRate,
              targetSampleRate
            );

            // 원본 오디오 데이터를 OfflineAudioContext로 복사하여 샘플링 레이트 변환
            const source = offlineContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(offlineContext.destination);
            source.start(0);

            const renderedBuffer = await offlineContext.startRendering();

            // WAV 헤더 작성 및 변환된 PCM 데이터 추가
            const wavBlob = audioBufferToWav(renderedBuffer);
            resolve(wavBlob);
          } else {
            // 이미 16000Hz일 경우 그대로 반환
            const wavBlob = audioBufferToWav(audioBuffer);
            resolve(wavBlob);
          }
        };

        reader.readAsArrayBuffer(blob);
      });
    };

    // AudioBuffer를 WAV 포맷으로 변환하는 함수
    const audioBufferToWav = (buffer: AudioBuffer): Blob => {
      const numOfChan = buffer.numberOfChannels;
      const length = buffer.length * numOfChan * 2 + 44;
      const bufferView = new DataView(new ArrayBuffer(length));
      let offset = 0;

      /* WAV 파일 헤더 작성 */
      const writeString = (s: string) => {
        for (let i = 0; i < s.length; i++) {
          bufferView.setUint8(offset++, s.charCodeAt(i));
        }
      };

      const write16 = (value: number) => {
        bufferView.setUint16(offset, value, true);
        offset += 2;
      };

      const write32 = (value: number) => {
        bufferView.setUint32(offset, value, true);
        offset += 4;
      };

      writeString("RIFF"); // ChunkID
      write32(length - 8); // ChunkSize
      writeString("WAVE"); // Format
      writeString("fmt "); // Subchunk1ID
      write32(16); // Subchunk1Size (PCM)
      write16(1); // AudioFormat (PCM)
      write16(numOfChan); // NumChannels
      write32(buffer.sampleRate); // SampleRate
      write32(buffer.sampleRate * numOfChan * 2); // ByteRate
      write16(numOfChan * 2); // BlockAlign
      write16(16); // BitsPerSample
      writeString("data"); // Subchunk2ID
      write32(buffer.length * numOfChan * 2); // Subchunk2Size

      // PCM 데이터 작성
      for (let i = 0; i < buffer.length; i++) {
        for (let channel = 0; channel < numOfChan; channel++) {
          const sample = buffer.getChannelData(channel)[i] * 0x7fff; // [-1, 1] 범위의 float을 16bit int로 변환
          bufferView.setInt16(offset, sample, true);
          offset += 2;
        }
      }

      return new Blob([bufferView], { type: "audio/wav" });
    };

    // webm 파일을 wav로 변환
    const wavBlob = await convertToWav(webmBlob);

    // 변환된 파일을 File 객체로 변환
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

    reco.recognizing = (_, e) => {
      // 실시간으로 인식 중인 텍스트를 업데이트
      setRecognizingText(e.result.text);
      console.log(`Recognizing: ${e.result.text}`);
    };

    reco.recognized = (_, e) => {
      if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
        console.log(`Final recognized text: ${e.result.text}`);

        const pronunciationResult =
          sdk.PronunciationAssessmentResult.fromResult(e.result);

        if (pronunciationResult) {
          console.log(
            "Pronunciation Score:",
            pronunciationResult.pronunciationScore
          );
          console.log("Accuracy Score:", pronunciationResult.accuracyScore);
          console.log("Fluency Score:", pronunciationResult.fluencyScore);
          console.log("Prosody Score:", pronunciationResult.prosodyScore);

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
      // 인식이 끝나면 각 점수의 평균을 계산하여 클라이언트에게 노출 (소수 1자리까지)
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

  const setCurrentLocation = useSetRecoilState(locationState);
  useEffect(() => {
    setCurrentLocation("Speaking Test Page");
  });

  // 이하 TTS
  // Azure Speech 서비스 구독 설정
  speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";
  const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

  const handleRead = () =>
    synthesizer.speakTextAsync(
      reference_text,
      (result) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          console.log("Synthesis completed. Audio was played.");
        } else {
          console.error("Speech synthesis canceled: ", result.errorDetails);
        }
        synthesizer.close();
      },
      (err) => {
        console.error("Error: ", err);
        synthesizer.close();
      }
    );

  return (
    <div>
      <h1>Speaking Test Page</h1>

      {/* 녹음 버튼 및 상태 표시 */}
      <button onClick={startRecording} disabled={status === "recording"}>
        {status === "recording" ? "Recording..." : "Start Recording"}
      </button>
      <button onClick={stopRecording} disabled={status !== "recording"}>
        Stop Recording
      </button>

      {/* 녹음 중일 때 시각적 효과 (ex: 녹음 중 애니메이션) */}
      {status === "recording" && (
        <div style={{ color: "red", fontWeight: "bold" }}>녹음중...</div>
      )}

      {/* 녹음된 오디오 파일 재생 */}
      {mediaBlobUrl && (
        <div>
          <h3>Recorded Audio</h3>
          <audio controls src={mediaBlobUrl}></audio>
        </div>
      )}

      <button onClick={handleSubmit} disabled={!mediaBlobUrl || isLoading}>
        {isLoading ? "Processing..." : "Submit for Evaluation"}
      </button>

      <h3>Origin Text</h3>
      <p>{reference_text}</p>
      <button onClick={handleRead}>음성 재생</button>

      {/* 실시간 인식 텍스트 표시 */}
      {recognizingText && (
        <div>
          <h3>Recognizing Text...</h3>
          <p>{recognizingText}</p>
        </div>
      )}

      {/* 최종 인식된 텍스트 출력 */}
      {recognitionResult && (
        <div>
          <h3>Final Recognition Result</h3>
          <p>{recognitionResult}</p>
        </div>
      )}

      {/* 최종 발음 평가 점수 출력 */}
      {averagePronunciationScore !== null && (
        <div>
          <h3>Average Pronunciation Assessment Scores</h3>
          <p>Average Pronunciation Score: {averagePronunciationScore}</p>
          <p>Average Accuracy Score: {averageAccuracyScore}</p>
          <p>Average Fluency Score: {averageFluencyScore}</p>
          <p>Average Prosody Score: {averageProsodyScore}</p>
        </div>
      )}

      {/* Completeness 점수 출력 */}
      {completenessScore !== null && (
        <div>
          <h3>Completeness Score</h3>
          <p>{completenessScore}%</p>
        </div>
      )}
    </div>
  );
};

export default SpeakingTestPage;

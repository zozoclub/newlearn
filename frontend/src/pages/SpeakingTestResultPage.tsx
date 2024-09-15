import React, { useEffect, useState } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { useSetRecoilState } from "recoil";
import locationState from "@store/locationState";
import SpeakingTestResultReference from "@components/SpeakingTestResultReference"; // Import the refactored component

import styled from "styled-components";

const SpeakingTestResultPage: React.FC = () => {
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    import.meta.env.VITE_SPEECH_API_KEY,
    import.meta.env.VITE_SPEECH_REGION
  );

  const reference_text =
    "Today was a beautiful day. We had a great time taking a long walk outside in the morning. The sun was shining brightly, and a gentle breeze made the weather feel perfect. As we strolled through the park, we noticed the trees swaying softly, and the sound of birds chirping filled the air.";
  const reference_text_translate =
    "오늘은 정말 아름다운 날이었어. 우리는 아침에 긴 산책을 하며 즐거운 시간을 보냈어. 해가 밝게 빛나고, 부드러운 바람이 날씨를 완벽하게 만들어줬어. 공원을 걷다가 나무들이 부드럽게 흔들리는 것을 봤고, 새들이 지저귀는 소리가 공기를 가득 채웠어.";

  const setCurrentLocation = useSetRecoilState(locationState);
  useEffect(() => {
    setCurrentLocation("Speaking Test Result Page");
  }, [setCurrentLocation]);

  const [isSpeaking, setIsSpeaking] = useState(false); // 음성 재생 상태

  speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";
  const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();

  // 음성 재생 핸들러
  const handleRead = (sentence: string) => {
    if (isSpeaking) return;

    setIsSpeaking(true);
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    synthesizer.speakTextAsync(
      sentence,
      (result) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          console.log("Synthesis completed.");
        }
        synthesizer.close();
        setIsSpeaking(false); // 음성 재생 완료 후 상태 업데이트
      },
      (err) => {
        console.error("Error: ", err);
        synthesizer.close();
        setIsSpeaking(false); // 에러 발생 시 상태 해제
      }
    );
  };

  return (
    <MainLayout>
      <MainContainer></MainContainer>
      <MainContainer>
        {/* Refactored component */}
        <SpeakingTestResultReference
          referenceTest={reference_text}
          referenceTextTranslate={reference_text_translate}
          handleRead={handleRead}
          isSpeaking={isSpeaking}
        />
      </MainContainer>
    </MainLayout>
  );
};

export default SpeakingTestResultPage;

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

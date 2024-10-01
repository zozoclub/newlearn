import React, { useState, useEffect } from "react";
import styled from "styled-components";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import SpeakerClickIcon from "@assets/icons/SpeakerIcon";

type Props = {
  referenceTest: string;
  referenceTextTranslate: string;
  audioUrl: string;
};

const SpeakingTestResultReference: React.FC<Props> = ({
  referenceTest,
  referenceTextTranslate,
  audioUrl,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [synthesizer, setSynthesizer] = useState<sdk.SpeechSynthesizer | null>(null);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (synthesizer) {
        synthesizer.close();
        console.log("TTS 정지");
      }
      if (audioPlayer) {
        audioPlayer.pause();
        console.log("클라이언트 음성 정지");
      }
    };
  }, [synthesizer, audioPlayer]);

  const speechConfig = sdk.SpeechConfig.fromSubscription(
    import.meta.env.VITE_SPEECH_API_KEY,
    import.meta.env.VITE_SPEECH_REGION
  );
  speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";
  const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();

  const handleRead = (sentence: string) => {
    if (isSpeaking || isAudioPlaying) return; // 다른 재생 중에는 불가

    setIsSpeaking(true);

    if (synthesizer) {
      synthesizer.close();
    }

    const newSynthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
    setSynthesizer(newSynthesizer);

    newSynthesizer.speakTextAsync(
      sentence,
      (result) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          console.log("TTS synthesis completed.");
        }
        newSynthesizer.close();
        setIsSpeaking(false);
        setSynthesizer(null);
      },
      (err) => {
        console.error("TTS Error: ", err);
        newSynthesizer.close();
        setIsSpeaking(false);
        setSynthesizer(null);
      }
    );
  };

  const handlePlayRecordedAudio = () => {
    if (isSpeaking || isAudioPlaying) return;

    setIsAudioPlaying(true);

    if (audioPlayer) {
      audioPlayer.pause();
    }

    const newAudioPlayer = new Audio(audioUrl);
    setAudioPlayer(newAudioPlayer);

    newAudioPlayer.play()
      .then(() => {
        console.log("Audio playback started.");
      })
      .catch((error) => {
        console.error("Error during audio playback:", error);
      });

    newAudioPlayer.onended = () => {
      setAudioPlayer(null);
      setIsAudioPlaying(false);
      console.log("Audio playback finished.");
    };
  };

  // 영어 및 한국어 문장 분리
  const englishSentences = referenceTest.split(". ").map((sentence) => sentence.trim());
  const koreanSentences = referenceTextTranslate.split(". ").map((sentence) => sentence.trim());

  return (
    <SentenceArea>
      {/* 클라이언트 음성 재생 */}
      <RecordedAudioBlock>
        <SpeakerIcon onClick={handlePlayRecordedAudio} disabled={isAudioPlaying || isSpeaking}>
          <SpeakerClickIcon />
        </SpeakerIcon>
        <RecordedAudioText>내 음성 다시 듣기</RecordedAudioText>
      </RecordedAudioBlock>
      {englishSentences.map((sentence, index) => (
        <SentenceBlock key={index}>
          {/* TTS */}
          <SpeakerIcon onClick={() => !isSpeaking && handleRead(sentence)} disabled={isSpeaking || isAudioPlaying}>
            <SpeakerClickIcon />
          </SpeakerIcon>
          <TextBlock>
            <EnglishSentence>{sentence}.</EnglishSentence>
            <KoreanSentence>{koreanSentences[index]}</KoreanSentence>
          </TextBlock>
        </SentenceBlock>
      ))}
    </SentenceArea>
  );
};

export default SpeakingTestResultReference;

const SentenceArea = styled.div`
  position: relative;
  width: 90%;
  margin: 0.75rem;
  padding: 3%;
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
`;

const EnglishSentence = styled.div`
  font-size: 1.25rem;
  font-weight: 200;
`;

const KoreanSentence = styled.div`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.primary};
  margin-top: 0.5rem;
`;

const SentenceBlock = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 2rem;
`;

const SpeakerIcon = styled.div<{ disabled: boolean }>`
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  &:hover {
    transform: ${({ disabled }) => (disabled ? "none" : "scale(1.1)")};
    transition: transform 0.2s ease;
  }
`;

const RecordedAudioBlock = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
`;

const RecordedAudioText = styled.div`
  font-size: 1rem;
  margin-left: 0.75rem;
  color: ${(props) => props.theme.colors.primary};
`;

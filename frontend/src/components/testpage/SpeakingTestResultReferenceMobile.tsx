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
  const [synthesizer, setSynthesizer] = useState<sdk.SpeechSynthesizer | null>(
    null
  );
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (synthesizer) {
        synthesizer.close(); // TTS 정지
        console.log("TTS 정지");
      }
      if (audioPlayer) {
        audioPlayer.pause(); // 클라이언트 음성 정지
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

  // TTS 음성 재생 핸들러
  const handleRead = (sentence: string) => {
    if (isSpeaking || isAudioPlaying) return; // 다른 음성이 재생 중이면 중단

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

  // 클라이언트 녹음 파일 재생 핸들러
  const handlePlayRecordedAudio = () => {
    if (isSpeaking || isAudioPlaying) return; // 다른 음성이 재생 중이면 중단

    setIsAudioPlaying(true);

    if (audioPlayer) {
      audioPlayer.pause(); // 기존 오디오 재생 종료
    }

    const newAudioPlayer = new Audio(audioUrl);
    setAudioPlayer(newAudioPlayer);

    newAudioPlayer
      .play()
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
  const englishSentences = referenceTest
    .split(". ")
    .map((sentence) => sentence.trim());
  const koreanSentences = referenceTextTranslate
    .split(". ")
    .map((sentence) => sentence.trim());

  return (
    <SentenceArea>
      {/* 클라이언트 음성 */}
      <RecordedAudioBlock>
        <RecordedAudioText>내 음성 다시 듣기</RecordedAudioText>
        <SpeakerIcon
          onClick={handlePlayRecordedAudio}
          disabled={isAudioPlaying || isSpeaking}
        >
          <SpeakerClickIcon width="20" height="20" />
        </SpeakerIcon>
      </RecordedAudioBlock>
      {englishSentences.map((sentence, index) => (
        <SentenceBlock key={index}>
          {/* TTS 음성 */}
          <SpeakerIcon
            onClick={() => !isSpeaking && handleRead(sentence)}
            disabled={isSpeaking || isAudioPlaying}
          >
            <SpeakerClickIcon width="20" height="20" />
          </SpeakerIcon>
          <TextBlock>
            <EnglishSentence>
              {sentence}
              {index !== englishSentences.length - 1 && "."}
            </EnglishSentence>
            <KoreanSentence>{koreanSentences[index]}</KoreanSentence>
          </TextBlock>
        </SentenceBlock>
      ))}
    </SentenceArea>
  );
};

export default SpeakingTestResultReference;

const SentenceArea = styled.div``;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

const EnglishSentence = styled.div`
  font-size: 1.125rem;
  font-weight: 500;
  letter-spacing: 0.001px;
  line-height: 1.2;
`;

const KoreanSentence = styled.div`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.text04};
  font-weight: 300;
  margin-top: 0.25rem;
  letter-spacing: 0.01rem;
  line-height: 1.3;
`;

const SentenceBlock = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const SpeakerIcon = styled.div<{ disabled: boolean }>`
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  &:hover {
    transform: ${({ disabled }) => (disabled ? "none" : "scale(1.1)")};
    transition: transform 0.2s ease;
  }
  margin-right: 0.25rem;
`;

const RecordedAudioBlock = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  margin: 1rem;
`;

const RecordedAudioText = styled.div`
  font-size: 1rem;
  margin-right: 0.375rem;
  color: ${(props) => props.theme.colors.text};
`;

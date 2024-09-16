import React from "react";
import styled from "styled-components";
import SpeakerClickIcon from "@assets/icons/SpeakerIcon";

type Props = {
  referenceTest: string;
  referenceTextTranslate: string;
  handleRead: (sentence: string) => void;
  isSpeaking: boolean;
};

const SpeakingTestResultReference: React.FC<Props> = ({
  referenceTest,
  referenceTextTranslate,
  handleRead,
  isSpeaking,
}) => {
  // 마침표를 기준으로 문장을 나누고 공백을 제거
  const englishSentences = referenceTest
    .split(". ")
    .map((sentence) => sentence.trim());
  const koreanSentences = referenceTextTranslate
    .split(". ")
    .map((sentence) => sentence.trim());

  return (
    <SentenceArea>
      {englishSentences.map((sentence, index) => (
        <SentenceBlock key={index}>
          {/* 스피커 아이콘 클릭 이벤트 추가 */}
          <SpeakerIcon
            onClick={() => !isSpeaking && handleRead(sentence)}
            disabled={isSpeaking}
          >
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

import React from "react";
import styled from "styled-components";

type Props = {
  referenceTest: string;
  referenceTextTranslate: string;
};

const SpeakingTestReference: React.FC<Props> = ({
  referenceTest,
  referenceTextTranslate,
}) => {
  // 마침표를 기준으로 문장을 나누고 공백을 제거
  const englishSentences = referenceTest
    .split(". ")
    .map((sentence) => sentence.trim());
  const koreanSentences = referenceTextTranslate
    .split(". ")
    .map((sentence) => sentence.trim());
  return (
    <>
      <SentenceArea>
        {englishSentences.map((sentence, index) => {
          return (
            <div key={index}>
              <EnglishSentence>
                {sentence}.
                <br />
              </EnglishSentence>
              <br />
              <KoreanSentence>{koreanSentences[index]}</KoreanSentence>
              <br />
              <br />
            </div>
          );
        })}
      </SentenceArea>
    </>
  );
};

export default SpeakingTestReference;

const SentenceArea = styled.div`
  width: 100%;
  margin: 0.75rem;
  padding: 3%;
`;

const EnglishSentence = styled.div`
  font-size: 1.25rem;
  font-weight: 200;
`;

const KoreanSentence = styled.div`
  color: ${(props) => props.theme.colors.primary};
  font-size: 1rem;
`;

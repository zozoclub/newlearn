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
        {englishSentences.map((sentence, index) => (
          <div key={index}>
            <EnglishSentence>
              {sentence}
              {index !== englishSentences.length && "."}
              <br />
            </EnglishSentence>
            <KoreanSentence>
              {koreanSentences[index]}
              {index !== koreanSentences.length && "."}
            </KoreanSentence>
            <br />
            <br />
            <br />
            <br />
          </div>
        ))}
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
  font-size: 1.375rem;
  font-weight: 300;
  letter-spacing: 0.002rem; 
  line-height: 1.5;
`;

const KoreanSentence = styled.div`
  font-size: 1.25rem;
  color: ${(props) => props.theme.colors.text04};
  font-weight: 400;
  margin-top: 0.5rem;
  letter-spacing: 0.002rem; 
  line-height: 1.5;
`;

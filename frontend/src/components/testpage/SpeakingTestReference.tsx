import React from "react";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive"; // 모바일 여부 감지

type Props = {
  referenceTest: string;
  referenceTextTranslate: string;
};

const SpeakingTestReference: React.FC<Props> = ({
  referenceTest,
  referenceTextTranslate,
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
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
            {isMobile && (
              <>
                <br />
              </>
            )}
            <KoreanSentence>
              {koreanSentences[index]}
              {index !== koreanSentences.length && "."}
            </KoreanSentence>
            <br />
            <br />
            {!isMobile && (
              <>
                <br />
                <br />
              </>
            )}
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

  @media (max-width: 768px) {
    padding: 0%;
    width: 90%;
  }
`;

const EnglishSentence = styled.div`
  font-size: 1.375rem;
  font-weight: 500;
  letter-spacing: 0.0001rem;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 1.125rem;
    line-height: 1.4;
  }
`;

const KoreanSentence = styled.div`
  font-size: 1.25rem;
  color: ${(props) => props.theme.colors.text04};
  font-weight: 400;
  margin-top: 0.5rem;
  letter-spacing: 0.002rem;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.4;
    margin-top: 0.25rem;
  }
`;

import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import locationState from "@store/locationState";
import styled from "styled-components";
import BackArrow from "@assets/icons/BackArrow";

import WordTestResultWordList from "@components/WordTestResultWordList";
import WordTestResultWordDetail from "@components/WordTestResultWordDetail";

const WordTestResultPage: React.FC = () => {
  const setCurrentLocation = useSetRecoilState(locationState);
  useEffect(() => {
    setCurrentLocation("Word Test Page");
  }, [setCurrentLocation]);

  const [currentWord, setCurrentWord] = useState<number>(0);

  const wordExplainDetailHandler = (index: number) => {
    setCurrentWord(index);
  };

  // TODO: 예문을 어떻게 저장하는지 알아야함.
  const data = [
    {
      word: "foundation",
      userAnswer: "foundation",
      sentence: "The foundation of the building was laid in 1920.",
      sentenceTranslation: "그 건물의 기초는 1920년에 놓였다.",
    },
    {
      word: "fromisnine",
      userAnswer: "fromisnine",
      sentence:
        "fromisnine is a popular K-pop girl group known for their energetic performances.",
      sentenceTranslation:
        "프로미스나인은 에너지 넘치는 공연으로 유명한 K-pop 걸그룹이다.",
    },
    {
      word: "facility",
      userAnswer: "facitily",
      sentence: "The new sports facility will open next month.",
      sentenceTranslation: "새로운 스포츠 시설은 다음 달에 개장할 예정이다.",
    },
    {
      word: "found",
      userAnswer: "fuck",
      sentence: "The detectives found a clue that could solve the mystery.",
      sentenceTranslation: "형사들은 그 미스터리를 풀 단서를 발견했다.",
    },
    {
      word: "firebase",
      userAnswer: "firebase",
      sentence:
        "Developers use Firebase for building mobile and web applications.",
      sentenceTranslation:
        "개발자들은 모바일 및 웹 애플리케이션을 구축하기 위해 Firebase를 사용한다.",
    },
  ];

  return (
    <MainLayout>
      <MainContainer>
        <BackHeader>
          <BackArrow />
          평가 리스트로 돌아가기
        </BackHeader>
        <WordListLayout>
          {data.map((data, index) => {
            return (
              <WordTestResultWordList
                word={data.word}
                key={index}
                onClick={() => wordExplainDetailHandler(index)}
              />
            );
          })}
        </WordListLayout>
      </MainContainer>
      <MainContainer>
        <WordExplainContainer>
          {currentWord ? (
            <WordTestResultWordDetail
              userAnswer={data[currentWord].userAnswer}
              sentence={data[currentWord].sentence}
              sentenceTranslation={data[currentWord].sentenceTranslation}
            />
          ) : (
            <WordTestResultWordDetail
              userAnswer={data[currentWord].userAnswer}
              sentence={data[currentWord].sentence}
              sentenceTranslation={data[currentWord].sentenceTranslation}
            />
          )}
        </WordExplainContainer>
      </MainContainer>
    </MainLayout>
  );
};

export default WordTestResultPage;

const MainContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;

  width: 90%;
  min-height: 45rem;

  margin: 0 0.5rem;
  padding: 0.5rem;

  background-color: ${(props) => props.theme.colors.cardBackground + "BF"};
  box-shadow: 0.5rem 0.5rem 0.25rem ${(props) => props.theme.colors.shadow};

  border-radius: 0.75rem;

  transition: box-shadow 0.5s;

  backdrop-filter: blur(0.25rem);
`;

const BackHeader = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  padding-left: 1rem;
  font-size: 1.5rem;
  font-weight: 700;
`;

const MainLayout = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const WordListLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const WordExplainContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 600px;
  text-align: center;
`;

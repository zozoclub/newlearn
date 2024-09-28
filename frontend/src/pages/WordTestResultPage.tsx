import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import locationState from "@store/locationState";
import styled from "styled-components";
import BackArrow from "@assets/icons/BackArrow";

import WordTestResultWordList from "@components/testpage/WordTestResultWordList";
import WordTestResultWordDetail from "@components/testpage/WordTestResultWordDetail";

import PerfectStamp from "@assets/icons/PerfectStamp";
import GreatStamp from "@assets/icons/GreatStamp";
import GoodStamp from "@assets/icons/GoodStamp";
import BadStamp from "@assets/icons/BadStamp";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getWordTestResultDetail, WordTestResultDetailResponseDto } from "@services/wordTestService";
import Spinner from "@components/Spinner";

const WordTestResultPage: React.FC = () => {
  const { wordId } = useParams<{ wordId: string }>();
  const setCurrentLocation = useSetRecoilState(locationState);
  useEffect(() => {
    setCurrentLocation("Word Test Page");
  }, [setCurrentLocation]);

  const { data: testDetail, isLoading, error } = useQuery<WordTestResultDetailResponseDto>(
    {
      queryKey: ["wordTestDetail", wordId],
      queryFn: () => getWordTestResultDetail(Number(wordId)),
    }
  );

  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentWord, setCurrentWord] = useState<string>("");


  const wordExplainDetailHandler = (index: number) => {
    setCurrentWordIndex(index);
    setCurrentWord(data[index].word);
  };

  // TODO: 예문을 어떻게 저장하는지 알아야함.
  const data = [
    {
      word: "foundation",
      userAnswer: "foundation",
      sentence:
        "The foundation of the charity was established in 2005 to help children in need.",
      sentenceTranslation:
        "그 자선 단체의 기초는 2005년에 어려운 아이들을 돕기 위해 설립되었다.",
    },
    {
      word: "fromisnine",
      userAnswer: "fromisnine",
      sentence:
        "fromisnine gained a large fanbase after their debut performance on national TV.",
      sentenceTranslation:
        "프로미스나인은 그들의 데뷔 무대 이후 많은 팬층을 확보했다.",
    },
    {
      word: "facilities",
      userAnswer: "facitily",
      sentence:
        "The hospital has state-of-the-art medical facilities for patient care.",
      sentenceTranslation:
        "그 병원은 환자 치료를 위한 최신식 의료 시설을 갖추고 있다.",
    },
    {
      word: "found",
      userAnswer: "fuck",
      sentence: "She found her keys under the pile of books on her desk.",
      sentenceTranslation: "그녀는 책 더미 아래에서 열쇠를 발견했다.",
    },
    {
      word: "firebase",
      userAnswer: "firebase",
      sentence:
        "Firebase allows developers to quickly deploy and manage applications.",
      sentenceTranslation:
        "Firebase는 개발자들이 애플리케이션을 빠르게 배포하고 관리할 수 있게 해준다.",
    },
    {
      word: "inspiration",
      userAnswer: "inspiration",
      sentence:
        "The artist found inspiration for her latest work while traveling through Europe.",
      sentenceTranslation:
        "그 예술가는 유럽을 여행하는 동안 그녀의 최신 작품에 대한 영감을 얻었다.",
    },
    {
      word: "architecture",
      userAnswer: "architecture",
      sentence:
        "The architecture of the ancient temple was both intricate and breathtaking.",
      sentenceTranslation:
        "고대 사원의 건축 양식은 복잡하면서도 숨이 멎을 만큼 아름다웠다.",
    },
    {
      word: "technology",
      userAnswer: "technology",
      sentence:
        "Advances in technology have transformed the way we communicate.",
      sentenceTranslation: "기술의 발전은 우리의 의사소통 방식을 변화시켰다.",
    },
    {
      word: "sustainability",
      userAnswer: "sustainability",
      sentence:
        "Sustainability is at the heart of their business model, focusing on renewable resources.",
      sentenceTranslation:
        "지속 가능성은 그들의 비즈니스 모델의 핵심이며, 재생 가능한 자원에 중점을 둔다.",
    },
    {
      word: "community",
      userAnswer: "community",
      sentence:
        "The local community organized a fundraiser to support the new school project.",
      sentenceTranslation:
        "지역 사회는 새로운 학교 프로젝트를 지원하기 위해 기금 모금 행사를 조직했다.",
    },
  ];
  const dataDate = "2024-09-09";
  const dataScore = 80;

  const renderStamp = () => {
    if (dataScore > 90) return <PerfectStamp />;
    if (dataScore > 80) return <GreatStamp />;
    if (dataScore > 70) return <GoodStamp />;
    return <BadStamp />;
  };


  // 로딩 상태 처리
  if (isLoading) return <Spinner />;

  // 에러 상태 처리
  if (error) return <ErrorText>에러가 발생했습니다. 다시 시도해 주세요.</ErrorText>;

  // testDetail이 null일 때
  if (!testDetail) return <ErrorText>No data available.</ErrorText>;

  return (
    <MainLayout>
      <MainContainer>
        <BackHeader>
          <BackArrow width={48} height={48} />
          평가 리스트로 돌아가기
        </BackHeader>
        <WordListLayout>
          {data.map((data, index) => {
            return (
              <WordTestResultWordList
                word={data.word}
                userAnswer={data.userAnswer}
                index={index}
                key={index}
                onClick={() => wordExplainDetailHandler(index)}
                isFocusWord={data.word === currentWord}
              />
            );
          })}
        </WordListLayout>
      </MainContainer>
      <MainContainer>
        <WordExplainContainer>
          {currentWord ? (
            <WordTestResultWordDetail
              answerWord={data[currentWordIndex].word}
              userAnswer={data[currentWordIndex].userAnswer}
              sentence={data[currentWordIndex].sentence}
              sentenceTranslation={data[currentWordIndex].sentenceTranslation}
            />
          ) : (
            <>
              <div>평가 날짜 : {dataDate}</div>
              <div>평가 점수 : {dataScore}</div>
              <div>{renderStamp()}</div>
            </>
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
  max-height: 45rem;

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

// 스크롤 추가
const WordListLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-top: 12rem;
  overflow-y: auto;
  overflow-x: hidden;
`;

const WordExplainContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: 0.75rem;
  width: 100%;
  text-align: center;
`;

const ErrorText = styled.div`
  color: ${(props) => props.theme.colors.danger};
  font-size: 1.25rem;
  text-align: center;
`;

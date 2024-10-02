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
import { useMediaQuery } from "react-responsive"; // 모바일 여부 감지
import WordTestResultListMobilePage from "./mobile/WordTestResultListMobilePage";

const WordTestResultPage: React.FC = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { quizId } = useParams<{ quizId: string }>();
  const setCurrentLocation = useSetRecoilState(locationState);

  useEffect(() => {
    setCurrentLocation("Word Test Page");
  }, [setCurrentLocation]);

  // 서버에서 데이터를 가져오기
  const {
    data: testDetail,
    isLoading,
    error,
  } = useQuery<WordTestResultDetailResponseDto[]>({
    queryKey: ["wordTestDetail", quizId],
    queryFn: () => getWordTestResultDetail(Number(quizId)),
  });

  // 현재 선택된 단어 인덱스와 단어
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentWord, setCurrentWord] = useState<string>("");

  // 서버에서 받은 데이터를 기존 형식에 맞게 변환
  const transformTestData = (testDetail: WordTestResultDetailResponseDto[]) => {
    return testDetail.map((item) => ({
      word: item.correctAnswer,
      userAnswer: item.answer,
      sentence: item.sentence,
      sentenceTranslation: "",
      correct: item.correct,
    }));
  };

  // testDetail이 있을 경우 변환, 없을 경우 빈 배열
  const data = testDetail ? transformTestData(testDetail) : [];

  const dataDate = "2024-10-01";
  const dataScore = data.length > 0
    ? (data.filter((item) => item.correct).length / data.length) * 100
    : 0;

  const wordExplainDetailHandler = (index: number) => {
    setCurrentWordIndex(index);
    setCurrentWord(data[index].word);
  };

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
  if (!testDetail || testDetail.length === 0) return <ErrorText>No data available.</ErrorText>;

  // 모바일
  if (isMobile) return <WordTestResultListMobilePage />;

  return (
    <MainLayout>
      <MainContainer>
        <BackHeader>
          <BackArrow width={48} height={48} url="/testhistory" />
          평가 리스트로 돌아가기
        </BackHeader>
        <WordListLayout>
          {data.map((item, index) => {
            return (
              <WordTestResultWordList
                word={item.word}
                userAnswer={item.userAnswer}
                index={index}
                key={index}
                onClick={() => wordExplainDetailHandler(index)}
                isFocusWord={item.word === currentWord}
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
              <div>평가 점수 : {dataScore.toFixed(2)}</div>
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

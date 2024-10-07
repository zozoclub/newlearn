import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import locationState from "@store/locationState";
import styled from "styled-components";
import BackArrow from "@assets/icons/BackArrow";
import WordTestResultWordList from "@components/testpage/WordTestResultWordList";
import WordTestResultWordDetail from "@components/testpage/WordTestResultWordDetail";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  getWordTestResultDetail,
  WordTestResultDetailResponseDto,
} from "@services/wordTestService";
import Spinner from "@components/Spinner";
import { useMediaQuery } from "react-responsive"; // 모바일 여부 감지
import WordTestResultDetailMobilePage from "./mobile/WordTestResultDetailMobilePage";

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
  } = useQuery<WordTestResultDetailResponseDto>({
    queryKey: ["wordTestDetail", quizId],
    queryFn: () => getWordTestResultDetail(Number(quizId)),
  });

  // 현재 선택된 단어 인덱스와 단어
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentWord, setCurrentWord] = useState<string>("");

  const wordExplainDetailHandler = (index: number) => {
    setCurrentWordIndex(index);
    setCurrentWord(testDetail!.result[index].correctAnswer);
  };

  useEffect(() => {
    if (testDetail) {
      setCurrentWord(testDetail.result[0].correctAnswer); // 첫 번째 단어 선택
    }
  }, [testDetail]);

  // 로딩 상태 처리
  if (isLoading) return <Spinner />;

  // 에러 상태 처리
  if (error)
    return <ErrorText>에러가 발생했습니다. 다시 시도해 주세요.</ErrorText>;

  // testDetail이 null일 때
  if (!testDetail)
    return <ErrorText>데이터가 없습니다.</ErrorText>;

  // 모바일
  if (isMobile) return <WordTestResultDetailMobilePage />;

  return (
    <MainLayout>
      <MainContainer>
        <BackHeader>
          <BackArrow width={48} height={48} url="/wordtesthistory" />
          <BackHeaderText>
            평가 리스트로 돌아가기
          </BackHeaderText>
        </BackHeader>
        <WordListLayout>
          {testDetail.result.map((item, index) => {
            return (
              <WordTestResultWordList
                word={item.correctAnswer}
                userAnswer={item.answer}
                index={index}
                key={index}
                onClick={() => wordExplainDetailHandler(index)}
                isFocusWord={item.correctAnswer === currentWord}
              />
            );
          })}
        </WordListLayout>
      </MainContainer>
      <MainContainer>
        <WordExplainContainer>
          {currentWord ? (
            <WordTestResultWordDetail
              newsId={testDetail.result[currentWordIndex].newsId}
              answerWord={testDetail.result[currentWordIndex].correctAnswer}
              userAnswer={testDetail.result[currentWordIndex].answer}
              difficulty={testDetail.result[currentWordIndex].difficulty}
              sentence={testDetail.result[currentWordIndex].sentence}
              sentenceMeaning={testDetail.result[currentWordIndex].sentenceMeaning}
              isCorrect={testDetail.result[currentWordIndex].correct}
              />
            ) : (
              <WordTestResultWordDetail
              newsId={testDetail.result[0].newsId}
              answerWord={testDetail.result[0].correctAnswer}
              userAnswer={testDetail.result[0].answer}
              difficulty={testDetail.result[currentWordIndex].difficulty}
              sentence={testDetail.result[0].sentence}
              sentenceMeaning={testDetail.result[0].sentenceMeaning}
              isCorrect={testDetail.result[0].correct}
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
  width: 45%;
  min-height: 45rem;
  max-height: 45rem;
  margin: 0 0.5rem;
  padding: 0.5rem;
  background-color: ${(props) => props.theme.colors.cardBackground01};
  box-shadow: ${(props) => props.theme.shadows.small};
  border-radius: 0.75rem;
  transition: box-shadow 0.5s;
  backdrop-filter: blur(0.25rem);
`;

const BackHeader = styled.div`
  display: flex;
  margin-right: auto;
  align-items: center;
  padding-top : 0.5rem;
  padding-left: 2rem;
  font-size: 1.5rem;
  font-weight: 700;
`;

const MainLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const WordListLayout = styled.div`
  justify-content: flex-start;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
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

const BackHeaderText = styled.span`
margin-left: 1rem;
`
import React, { useState, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import locationState from "@store/locationState";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import WordTestCollapsible from "@components/testpage/WordTestCollapsible";
import {
  getWordTestResultDetail,
  WordTestResultDetailResponseDto,
} from "@services/wordTestService";
import Spinner from "@components/Spinner";
import HeaderMobile from "@components/common/HeaderMobile";

const WordTestResultDetailMobilePage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const setCurrentLocation = useSetRecoilState(locationState);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentLocation("단어 테스트 결과");
  }, [setCurrentLocation]);

  const {
    data: testDetail,
    isLoading,
    error,
  } = useQuery<WordTestResultDetailResponseDto>({
    queryKey: ["wordTestDetail", quizId],
    queryFn: () => getWordTestResultDetail(Number(quizId)),
  });

  const [expandedWordIndex, setExpandedWordIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setExpandedWordIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const highlightWordInSentence = (sentence: string, word: string, isCorrect: boolean) => {
    const parts = sentence.split(new RegExp(`(${word})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === word.toLowerCase() ? (
        <HighlightedWord key={index} $isCorrect={isCorrect}>
          {part}
        </HighlightedWord>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  const handleNewsLinkClick = (newsId: number) => {
    navigate(`/news/detail/${newsId}`);
  };

  if (isLoading) return <Spinner />;

  if (error)
    return <ErrorText>데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해 주세요.</ErrorText>;

  if (!testDetail)
    return <ErrorText>결과 데이터가 없습니다.</ErrorText>;

  const totalQuestions = testDetail.result.length;
  const correctAnswers = testDetail.result.filter((test) => test.correct).length;

  return (
    <>
      <HeaderMobile title="빈칸 평가 결과" url={`/wordtesthistory`}/>
      <MobileMainContainer>
        <ScoreSummary>
          <ScoreText>Total : {totalQuestions} / Correct : {correctAnswers}</ScoreText>
        </ScoreSummary>
        {testDetail.result.map((test, index) => (
          <WordTestCollapsible
            key={index}
            title={test.correctAnswer}
            isExpanded={expandedWordIndex === index}
            onToggle={() => handleToggle(index)}
            isCorrect={test.correct}
          >
            <DetailSection>
              <DetailTitle>Sentence</DetailTitle>
              <DetailSentence>{highlightWordInSentence(test.sentence, test.correctAnswer, test.correct)}</DetailSentence>
              <SentenceMeaning>{test.sentenceMeaning}</SentenceMeaning>
            </DetailSection>
            <DetailSection>
              <DetailTitle>Answer</DetailTitle>
              <DetailContent $isCorrect={true}>{test.correctAnswer}</DetailContent>
            </DetailSection>
            <DetailSection>
              <DetailTitle>My Answer</DetailTitle>
              <DetailContent $isCorrect={test.correct}>
                {test.answer ? test.answer : "No Answer"}
              </DetailContent>
            </DetailSection>
            <ButtonsContainer>
              <DifficultyChip $difficulty={test.difficulty}>
                {test.difficulty === 1 ? "초급" : test.difficulty === 2 ? "중급" : "고급"}
              </DifficultyChip>
              <NewsLinkButton onClick={() => handleNewsLinkClick(test.newsId)}>
                원문 보기
              </NewsLinkButton>
            </ButtonsContainer>
          </WordTestCollapsible>
        ))}
      </MobileMainContainer>
    </>
  );
};

export default WordTestResultDetailMobilePage;

const MobileMainContainer = styled.div`
  width: 100%;
  background-color: ${(props) => props.theme.colors.cardBackground};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 5rem;
  letter-spacing: 0.001px;
`;

const ScoreSummary = styled.div`
  width: 90%;
  color: ${(props) => props.theme.colors.text};
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 0.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ScoreText = styled.div`
  font-size: 1rem;
  font-weight: bold;
`;

const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1.125rem;
`;

const DetailTitle = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const DetailContent = styled.div<{ $isCorrect?: boolean }>`
  font-size: 1rem;
  color: ${(props) => (props.$isCorrect ? props.theme.colors.primary : props.theme.colors.danger)};
  font-weight: bold;
`;

const DetailSentence = styled.div`
  font-size: 1.125rem;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const SentenceMeaning = styled.div`
  font-size: 0.875rem;
  letter-spacing: 0.001px;
  color: ${(props) => props.theme.colors.text04};
`;

const HighlightedWord = styled.span<{ $isCorrect: boolean }>`
  color: ${(props) => (props.$isCorrect ? props.theme.colors.primary : props.theme.colors.danger)};
  font-weight: bold;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const DifficultyChip = styled.div<{ $difficulty: number }>`
  background-color: ${({ $difficulty }) =>
    $difficulty === 1 ? "#4caf50" : $difficulty === 2 ? "#ff9800" : "#f44336"};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: bold;
`;

const NewsLinkButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }
`;

const ErrorText = styled.div`
  color: ${(props) => props.theme.colors.danger};
  font-size: 1.125rem;
  text-align: center;
  margin-top: 1rem;
`;

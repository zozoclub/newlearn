import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    ForgettingCurveWordListResponseDto,
    getForgettingCurveWordList,
    postSaveForgettingCurveWord,
    SaveForgettingCurveWordRequestDto,
    postSkipCurveWord
} from "@services/forgettingCurve";
import { words } from "@utils/words";

const RestudyQuizList: React.FC = () => {
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
    const [results, setResults] = useState<SaveForgettingCurveWordRequestDto[]>([]); // 결과를 저장하는 state

    const { data: questions, isLoading, error } = useQuery<ForgettingCurveWordListResponseDto[]>({
        queryKey: ["forgettingCurveQuestions"],
        queryFn: getForgettingCurveWordList,
    });

    // 최종 결과 제출 Mutation
    const submitResultsMutation = useMutation({
        mutationKey: ["saveCurveWordResults"],
        mutationFn: (saveData: SaveForgettingCurveWordRequestDto[]) => postSaveForgettingCurveWord(saveData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["forgettingCurveQuestions"] });
        },
    });

    // 문제 스킵 Mutation
    const skipMutation = useMutation({
        mutationKey: ["skipCurveWord"],
        mutationFn: (wordId: number) => postSkipCurveWord(wordId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["forgettingCurveQuestions"] });
        },
    });

    // 정답 선택 시 호출되는 함수
    const handleAnswerSelection = (selectedAnswer: string, question: ForgettingCurveWordListResponseDto) => {
        const isCorrect = selectedAnswer === question.word;
        if (isCorrect) setScore((prevScore) => prevScore + 1);

        setSelectedAnswers((prevAnswers) => [...prevAnswers, isCorrect ? "정답" : "오답"]);
        // 현재 문제 결과 저장
        setResults((prevResults) => [
            ...prevResults,
            {
                wordId: question.wordId,
                isDoing: true, 
                isCorrect: isCorrect,
            },
        ]);

        if (currentPage < questions!.length - 1) {
            setCurrentPage((prevPage) => prevPage + 1);
        } else {
            setCurrentPage(questions!.length);
        }
    };

    // 문제 스킵 시 호출되는 함수
    const handleSkip = (question: ForgettingCurveWordListResponseDto) => {
        skipMutation.mutate(question.wordId, {
            onSuccess: () => {
                // 스킵 요청 성공 시, 결과 배열에서 해당 문제를 제거
                setResults((prevResults) =>
                    prevResults.filter((result) => result.wordId !== question.wordId)
                );
                if (currentPage < questions!.length - 1) {
                    setCurrentPage((prevPage) => prevPage + 1);
                } else {
                    setCurrentPage(questions!.length);
                }
            },
        });
    };

    // 모달을 닫을 때 처리하는 함수: 풀지 않은 문제를 모두 틀린 것으로 기록
    const handleQuizExit = () => {
        const remainingQuestions = questions!.slice(currentPage);

        const remainingResults = remainingQuestions.map((question) => ({
            wordId: question.wordId,
            isDoing: false,
            isCorrect: false,
        }));

        // 남은 문제를 틀린 것으로 간주하여 결과에 추가
        const finalResults = [...results, ...remainingResults];

        // 결과 제출
        submitResultsMutation.mutate(finalResults);
    };

    useEffect(() => {
        // 모달이 닫힐 때 자동으로 퀴즈 종료 처리
        return () => {
            handleQuizExit();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading) return <LoadingText>로딩 중...</LoadingText>;
    if (error) return <ErrorText>문제를 불러오는 데 실패했습니다.</ErrorText>;

    return (
        <Container>
            <QuizContainer $currentPage={currentPage}>
                {questions!.map((question, index) => (
                    <QuestionWrapper key={index} $currentPage={currentPage} $index={index}>
                        <QuizWrapper>
                            <QuestionText>{question.sentence.replace("_____", "______")}</QuestionText>
                            <SentenceMeaning>{`문장 뜻: ${question.sentenceMeaning}`}</SentenceMeaning>
                            <WordNowLevel>{`현재 레벨: ${question.wordNowLevel}`}</WordNowLevel>
                            <WordMeaning>{`단어 뜻: ${question.wordMeaning}`}</WordMeaning>
                            <OptionsWrapper>
                                {generateOptions(question.word).map((option, idx) => (
                                    <OptionButton
                                        key={idx}
                                        onClick={() => handleAnswerSelection(option, question)}
                                    >
                                        {option}
                                    </OptionButton>
                                ))}
                            </OptionsWrapper>
                            <ActionButton onClick={() => handleSkip(question)}>스킵하기</ActionButton>
                        </QuizWrapper>
                    </QuestionWrapper>
                ))}

                {/* 결과 페이지 */}
                <QuestionWrapper $currentPage={currentPage} $index={questions!.length}>
                    <ResultPage>
                        <ResultText>{`퀴즈 완료! ${questions!.length}문제 중 ${score}문제를 맞추셨습니다.`}</ResultText>
                        {selectedAnswers.map((answer, index) => (
                            <AnswerReview key={index}>{`문제 ${index + 1}: ${answer}`}</AnswerReview>
                        ))}
                        <ActionButton onClick={handleQuizExit}>종료</ActionButton>
                    </ResultPage>
                </QuestionWrapper>
            </QuizContainer>
        </Container>
    );
};

// 정답 및 오답을 랜덤으로 생성하는 함수
const generateOptions = (correctAnswer: string) => {
    const incorrectAnswers = words
        .filter((word) => word.word !== correctAnswer)
        .map((word) => word.word)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3); // 오답 3개 추출
    return [...incorrectAnswers, correctAnswer].sort(() => 0.5 - Math.random()); // 정답+오답 랜덤 정렬
};

export default RestudyQuizList;



const SentenceMeaning = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.5rem;
  text-align: center;
`;

const WordNowLevel = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.5rem;
  text-align: center;
`;

const WordMeaning = styled.p`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const ActionButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border: none;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 0.5rem;
  cursor: pointer;
`;

const LoadingText = styled.p`
  font-size: 1.5rem;
  text-align: center;
  margin-top: 2rem;
`;

const ErrorText = styled.p`
  font-size: 1.5rem;
  text-align: center;
  color: red;
  margin-top: 2rem;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 35vh;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.cardBackground};
`;

const QuizContainer = styled.div<{ $currentPage: number }>`
  display: flex;
  width: 100%;
  max-width: 800px;
  height: 100%; 
  overflow: hidden;
  position: relative;
`;

const QuestionWrapper = styled.div<{ $currentPage: number; $index: number }>`
  position: absolute;
  width: 100%;
  height: 100%; 
  display: flex;
  justify-content: center;
  align-items: center;
  transform: ${({ $index, $currentPage }) =>
        $index === $currentPage
            ? "translateX(0)"
            : $index > $currentPage
                ? "translateX(100%)"
                : "translateX(-100%)"};
  transition: transform 0.5s ease-in-out;
`;

const QuizWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const QuestionText = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const OptionsWrapper = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap; 
  justify-content: center; 
`;

const OptionButton = styled.button`
  padding: 0.75rem 1rem;
  border: 1.5px solid ${({ theme }) => theme.colors.newsItemBackgroundPress};
  border-radius: 0.3rem;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  cursor: pointer;
  width: 10rem; 
  text-align: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;

const ResultPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.cardBackground};
`;

const ResultText = styled.p`
  font-size: 1.5rem;
  text-align: center;
  font-weight: bold;
`;

const AnswerReview = styled.p`
  margin-top: 0.5rem;
  font-size: 1.125rem;
`;
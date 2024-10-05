import React, { useState } from "react";
import styled from "styled-components";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    postSaveForgettingCurveWord,
    SaveForgettingCurveWordRequestDto,
    ForgettingCurveWordListResponseDto,
} from "@services/forgettingCurve";
import { words } from "@utils/words";

interface RestudyQuizListProps {
    onClose: () => void;
    questions?: ForgettingCurveWordListResponseDto[]; // 부모에서 전달받은 데이터
}

const RestudyQuizList: React.FC<RestudyQuizListProps> = ({ onClose, questions }) => {
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
    const [results, setResults] = useState<SaveForgettingCurveWordRequestDto[]>([]);

    // 정답 및 오답을 랜덤으로 생성하는 함수
    const generateOptions = (correctAnswer: string) => {
        const incorrectAnswers = words
            .filter((word) => word.word !== correctAnswer)
            .map((word) => word.word)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
        return [...incorrectAnswers, correctAnswer].sort(() => 0.5 - Math.random());
    };

    // 최종 결과 제출 Mutation
    const submitResultsMutation = useMutation({
        mutationFn: (saveData: SaveForgettingCurveWordRequestDto[]) => postSaveForgettingCurveWord(saveData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["forgettingCurveQuestions"] });
        },
    });

    // 모두 스킵 버튼 클릭 시 호출되는 함수
    const handleSkipAll = () => {
        const remainingQuestions = questions!.slice(currentPage).map((question) => ({
            wordId: question.wordId,
            isDoing: false,
            isCorrect: false,
        }));

        const finalResults = [...results, ...remainingQuestions];
        submitResultsMutation.mutate(finalResults, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    // 정답 선택 시 호출되는 함수
    const handleAnswerSelection = (selectedAnswer: string, question: ForgettingCurveWordListResponseDto) => {
        const isCorrect = selectedAnswer === question.word;
        if (isCorrect) setScore((prevScore) => prevScore + 1);

        setSelectedAnswers((prevAnswers) => [...prevAnswers, isCorrect ? "정답" : "오답"]);

        // 마지막 문제 처리
        if (currentPage === questions!.length - 1) {
            const updatedResults = [
                ...results,
                {
                    wordId: question.wordId,
                    isDoing: true,
                    isCorrect: isCorrect,
                },
            ];
            setResults(updatedResults);
            setTimeout(() => {
                submitResultsMutation.mutate(updatedResults, {
                    onSuccess: () => {
                        setCurrentPage(questions!.length);
                    },
                });
            }, 0);
        } else {
            // 일반적인 문제 처리
            setResults((prevResults) => [
                ...prevResults,
                {
                    wordId: question.wordId,
                    isDoing: true,
                    isCorrect: isCorrect,
                },
            ]);
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };


    // 문제 스킵 시 호출되는 함수
    const handleSkip = (question: ForgettingCurveWordListResponseDto) => {
        setResults((prevResults) => [
            ...prevResults,
            {
                wordId: question.wordId,
                isDoing: false,
                isCorrect: false,
            },
        ]);

        if (currentPage < questions!.length - 1) {
            setCurrentPage((prevPage) => prevPage + 1);
        } else {
            setCurrentPage(questions!.length);
            submitResultsMutation.mutate(results);
        }
    };

    const handleQuizExit = () => {
        onClose();
    };

    if (!questions || questions.length === 0) return <ErrorText>문제를 불러오는 데 실패했습니다.</ErrorText>;

    return (
        <Container>
            <SkipAllButton onClick={handleSkipAll}>All Skip</SkipAllButton>

            <QuizContainer $currentPage={currentPage}>
                {questions.map((question, index) => (
                    <QuestionWrapper key={index} $currentPage={currentPage} $index={index}>
                        <QuizWrapper>
                            <QuestionText>{question.sentence.replace("_____", "______")}</QuestionText>
                            <SentenceMeaning>{`문장 뜻: ${question.sentenceMeaning}`}</SentenceMeaning>
                            <WordNowLevel>{`현재 레벨: ${question.wordNowLevel}`}</WordNowLevel>
                            <WordMeaning>{`단어 뜻: ${question.wordMeaning}`}</WordMeaning>
                            <OptionsWrapper>
                                {generateOptions(question.word).map((option, idx) => (
                                    <OptionButton key={idx} onClick={() => handleAnswerSelection(option, question)}>
                                        {option}
                                    </OptionButton>
                                ))}
                            </OptionsWrapper>
                            <ActionButton onClick={() => handleSkip(question)}>Skip</ActionButton>
                        </QuizWrapper>
                    </QuestionWrapper>
                ))}

                <QuestionWrapper $currentPage={currentPage} $index={questions.length}>
                    <ResultPage>
                        <ResultText>{`퀴즈 완료! ${questions.length}문제 중 ${score}문제를 맞추셨습니다.`}</ResultText>
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

export default RestudyQuizList;

const SkipAllButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: red;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.3rem;
  cursor: pointer;
`;

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

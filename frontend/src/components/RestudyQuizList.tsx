import React, { useState } from "react";
import styled from "styled-components";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    postSaveForgettingCurveWord,
    SaveForgettingCurveWordRequestDto,
    ForgettingCurveWordListResponseDto,
    postSkipCurveWord
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
    const [skippedWords, setSkippedWords] = useState<number[]>([]); // 스킵된 단어들을 저장하는 상태

    // 정답 및 오답을 랜덤으로 생성하는 함수
    const generateOptions = (correctAnswer: string) => {
        const incorrectAnswers = words
            .filter((word) => word.word !== correctAnswer) // 서버에서 받은 단어와 중복되지 않도록 필터링
            .map((word) => word.word)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3); // 3개의 오답 생성
        return [...incorrectAnswers, correctAnswer].sort(() => 0.5 - Math.random()); // 정답과 오답을 섞어서 리턴
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
                const filteredResults = updatedResults.filter(
                    (result) => !skippedWords.includes(result.wordId) // 스킵된 단어 제외
                );
                submitResultsMutation.mutate(filteredResults, {
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
    const handleSkip = async (question: ForgettingCurveWordListResponseDto) => {
        await postSkipCurveWord(question.wordId); // 스킵 API 호출

        setSkippedWords((prev) => [...prev, question.wordId]); // 스킵된 단어 목록에 추가

        if (currentPage < questions!.length - 1) {
            setCurrentPage((prevPage) => prevPage + 1);
        } else {
            setCurrentPage(questions!.length);
        }
    };

    const handleQuizExit = () => {
        onClose();
    };

    // 서버에서 문제가 없을 때 처리
    if (!questions || questions.length === 0) return <ErrorText>문제를 불러오는 데 실패했습니다.</ErrorText>;

    return (
        <Container>
            {currentPage < questions.length && (
                <SkipAllButton onClick={handleSkipAll}>All Skip</SkipAllButton>
            )}

            <QuizContainer $currentPage={currentPage}>
                {questions.map((question, index) => (
                    <QuestionWrapper key={index} $currentPage={currentPage} $index={index}>
                        <QuizWrapper>
                            {/* 빈칸이 제대로 표시되도록 수정 */}
                            <QuestionText>{question.sentence.replace(question.word, "_______")}</QuestionText>
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
  background: linear-gradient(135deg, #ff6f61, #ff4e50);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 110, 95, 0.3);
  font-size: 1rem;
  font-weight: bold;
  transition: transform 0.2s ease-in-out, background-color 0.3s;

  &:hover {
    background: linear-gradient(135deg, #ff4e50, #ff6f61);
  }

  &:active {
    transform: translateY(0);
  }
`;

const QuizContainer = styled.div<{ $currentPage: number }>`
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  border-radius: 1rem;
`;

const QuestionWrapper = styled.div<{ $currentPage: number; $index: number }>`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1rem;
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
  padding: 2rem;
  border-radius: 1rem;
`;

const QuestionText = styled.p`
  font-size: 1.75rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2rem;
`;

const OptionsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
`;

const OptionButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 1px solid #cccccc;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, box-shadow 0.3s;
  font-size: 1.125rem;
  width: 12rem;
  text-align: center;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #ff6f61;
    color: white;
    box-shadow: 0 5px 12px rgba(255, 111, 97, 0.4);
  }

  &:active {
    background-color: #ff4e50;
    box-shadow: 0 3px 8px rgba(255, 78, 80, 0.5);
  }
`;

const ActionButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.75rem 2rem;
  border: none;
  background-color: #42b883;
  color: white;
  font-size: 1.125rem;
  font-weight: bold;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  box-shadow: 0 5px 15px rgba(66, 184, 131, 0.3);

  &:hover {
    background-color: #38a76d;
    box-shadow: 0 8px 20px rgba(56, 167, 109, 0.4);
  }

  &:active {
    background-color: #2c8f5e;
    box-shadow: 0 3px 12px rgba(44, 143, 94, 0.4);
  }
`;

const ResultPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.cardBackground};
`;

const ResultText = styled.p`
  font-size: 1.75rem;
  font-weight: bold;
  color: #42b883;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const AnswerReview = styled.p`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.75rem;
  text-align: center;
`;

const SentenceMeaning = styled.p`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.text04};
  margin-bottom: 1rem;
  text-align: center;
`;

const WordNowLevel = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.text03};
  margin-bottom: 0.75rem;
  text-align: center;
`;

const WordMeaning = styled.p`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text02};
  margin-bottom: 2rem;
  text-align: center;
`;

const ErrorText = styled.p`
  font-size: 1.5rem;
  text-align: center;
  color: #ff4e50;
  margin-top: 2rem;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 35vh;
  align-items: center;
  justify-content: center;
`;

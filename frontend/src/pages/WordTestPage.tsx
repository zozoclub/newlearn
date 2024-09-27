import React, { useEffect, useState, useRef } from "react";
import { useSetRecoilState } from "recoil";
import locationState from "@store/locationState";
import styled from "styled-components";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  getWordTestList,
  WordTestListResponseDto,
} from "@services/wordTestService";

import Spinner from "@components/Spinner";

const WordTestPage: React.FC = () => {
  const { totalCount } = useParams<{ totalCount: string }>();

  const setCurrentLocation = useSetRecoilState(locationState);
  useEffect(() => {
    setCurrentLocation("Word Test Page");
  }, [setCurrentLocation]);

  const { isLoading, error, data } = useQuery<WordTestListResponseDto>({
    queryKey: ["wordTestData", totalCount],
    queryFn: () => getWordTestList(Number(totalCount)),
  });

  // 퀴즈 형식으로 변환
  const generateQuizFromData = (data: WordTestListResponseDto) => {
    return data.tests.map((item) => ({
      // 단어의 길이만큼 빈칸을 생성
      question: item.sentence.replace(item.word, "_".repeat(item.word.length)),
      translation: item.sentenceMeaning,
      answer: item.word,
    }));
  };

  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지
  const [quiz, setQuiz] = useState<
    { question: string; translation: string; answer: string }[]
  >([]);

  // 데이터가 있을 때 퀴즈 생성
  useEffect(() => {
    if (data) {
      const processedQuiz = generateQuizFromData(data);
      setQuiz(processedQuiz);
      setUserAnswers(Array(processedQuiz.length).fill(""));
    }
  }, [data]);

  // 각 input 요소에 대한 ref 배열 생성
  const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);

  // 페이지당 문제를 나누기
  const questionsPerPage = 5;
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = quiz.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  const handleInputChange = (
    index: number,
    subIndex: number,
    value: string
  ) => {
    const newAnswers = [...userAnswers];
    const currentAnswer = userAnswers[indexOfFirstQuestion + index] || "";

    // 입력한 문자의 위치에만 해당 값을 대체
    const updatedAnswer = currentAnswer.split("");
    updatedAnswer[subIndex] = value;
    newAnswers[indexOfFirstQuestion + index] = updatedAnswer.join("");
    setUserAnswers(newAnswers);

    // 다음 빈칸으로 자동으로 포커스 이동
    if (value.length === 1 && inputRefs.current[index]?.[subIndex + 1]) {
      inputRefs.current[index][subIndex + 1]?.focus();
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    subIndex: number
  ) => {
    if (
      event.key === "Backspace" &&
      !userAnswers[indexOfFirstQuestion + index]?.[subIndex]
    ) {
      // 현재 칸이 비어 있고, Backspace를 누르면 이전 칸으로 포커스 이동
      if (inputRefs.current[index]?.[subIndex - 1]) {
        inputRefs.current[index][subIndex - 1]?.focus();
      }
    }
  };

  // 페이지 이동
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleSubmit = () => {
    let correctAnswers = 0;

    quiz.forEach((q, index) => {
      const userAnswer = userAnswers[index]?.toLowerCase().replace(/\s+/g, "");
      const correctAnswer = q.answer.toLowerCase().replace(/\s+/g, "");

      if (userAnswer === correctAnswer) {
        correctAnswers += 1;
      }
    });

    // 점수환산
    const score = (correctAnswers / quiz.length) * 100;
    console.log(`점수: ${score}점 (${correctAnswers}/${quiz.length} 정답)`);
  };

  // 로딩 상태 처리
  if (isLoading) return <Spinner />;

  // 에러 상태 처리
  if (error)
    return <ErrorText>에러가 발생했습니다. 다시 시도해 주세요.</ErrorText>;

  return (
    <MainContainer>
      {/* 페이지 표시 */}
      <PageInfo>
        {currentPage} / {Math.ceil(quiz.length / questionsPerPage)}
      </PageInfo>
      {/* 문제 랜더링 */}
      {currentQuestions.map((q, index) => {
        inputRefs.current[index] = [];
        return (
          <QuizContainer key={index}>
            <Question>
              {indexOfFirstQuestion + index + 1}.{" "}
              {q.question.split("______")[0]}
              {q.answer.split("").map((_, i) => (
                <BlankInput
                  key={i}
                  type="text"
                  ref={(el) => (inputRefs.current[index][i] = el)} // 각 input의 ref 설정
                  value={userAnswers[indexOfFirstQuestion + index]?.[i] || ""}
                  onChange={(e) => handleInputChange(index, i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index, i)} // Backspace 처리
                  maxLength={1} // 한 글자씩만 입력
                />
              ))}
              {q.question.split("______")[1]}
            </Question>
            <Translation>{q.translation}</Translation>
          </QuizContainer>
        );
      })}

      {/* 이전, 다음 버튼 */}
      <ButtonContainer>
        <PageButton onClick={handlePrevPage} disabled={currentPage === 1}>
          이전
        </PageButton>
        <PageButton
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(quiz.length / questionsPerPage)}
        >
          다음
        </PageButton>
      </ButtonContainer>

      {/* 제출 버튼 */}
      {currentPage === Math.ceil(quiz.length / questionsPerPage) && (
        <SubmitButtonContainer>
          <SubmitButton onClick={handleSubmit}>제출</SubmitButton>
        </SubmitButtonContainer>
      )}
    </MainContainer>
  );
};

export default WordTestPage;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 90%;
  min-height: 50rem;
  margin: auto;
  padding: 0.625rem;
  background-color: ${(props) => props.theme.colors.cardBackground + "BF"};
  backdrop-filter: blur(0.25rem);
  border-radius: 0.75rem;
  box-shadow: 0.5rem 0.5rem 0.25rem ${(props) => props.theme.colors.shadow};
  transition: box-shadow 0.5s;
`;

const PageInfo = styled.div`
  position: absolute;
  top: 1rem;
  right: 2rem;
  font-size: 1.2rem;
  font-weight: bold;
`;

const QuizContainer = styled.div`
  width: 100%;
  margin-bottom: 1.5rem;
  margin-left: 3rem;
  text-align: left;
`;

const Question = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  display: flex;
  align-items: center;
`;

const Translation = styled.div`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  margin-left: 1.375rem;
`;

const BlankInput = styled.input`
  width: 0.875rem;
  padding: 0.25rem;
  margin: 0 0.125rem;
  border: 1px solid ${(props) => props.theme.colors.primary};
  border-radius: 0.25rem;
  text-align: center;
  font-size: 1.125rem;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;

  &:focus {
    outline: none;
    box-shadow: 0 0 0.25rem ${(props) => props.theme.colors.primaryPress};
  }

  &:hover {
    cursor: text;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SubmitButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 2rem;
`;

const SubmitButton = styled(PageButton)`
  background-color: ${(props) => props.theme.colors.primary};
  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }
`;

const ErrorText = styled.div`
  color: ${(props) => props.theme.colors.danger};
  font-size: 1.25rem;
  text-align: center;
`;
import React, { useEffect, useState, useRef } from "react";
import { useSetRecoilState } from "recoil";
import locationState from "@store/locationState";
import styled from "styled-components";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getWordTestList,
  postWordTestResult,
  WordTestListResponseDto,
  WordTestRequestDto,
} from "@services/wordTestService";

import Spinner from "@components/Spinner";
import Modal from "@components/Modal";

const WordTestMobilePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const totalCount = searchParams.get("totalCount");
  console.log(totalCount);

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (wordTestResultDataSet: WordTestRequestDto) =>
      postWordTestResult(wordTestResultDataSet),
    onSuccess: () => {
      console.log("결과 전달 완료");
      navigate(`/wordtestresult/${data!.quizId}`);
    },
  });

  const setCurrentLocation = useSetRecoilState(locationState);
  useEffect(() => {
    setCurrentLocation("Word Test Page");
  }, [setCurrentLocation]);

  const { isLoading, error, data } = useQuery<WordTestListResponseDto>({
    queryKey: ["wordTestData", Number(totalCount)],
    queryFn: () => getWordTestList(Number(totalCount)),
  });

  const generateQuizFromData = (data: WordTestListResponseDto) => {
    return data.tests.map((item) => ({
      question: item.sentence.replace(item.word, "_".repeat(item.word.length)),
      translation: item.sentenceMeaning,
      answer: item.word,
    }));
  };

  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [quiz, setQuiz] = useState<
    { question: string; translation: string; answer: string }[]
  >([]);

  useEffect(() => {
    if (data) {
      const processedQuiz = generateQuizFromData(data);
      setQuiz(processedQuiz);
      setUserAnswers(Array(processedQuiz.length).fill(""));
    }
  }, [data]);

  const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);

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

    const updatedAnswer = currentAnswer.split("");
    updatedAnswer[subIndex] = value;
    newAnswers[indexOfFirstQuestion + index] = updatedAnswer.join("");
    setUserAnswers(newAnswers);

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
      if (inputRefs.current[index]?.[subIndex - 1]) {
        inputRefs.current[index][subIndex - 1]?.focus();
      }
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const [isSubmitModal, setIsSubmitModal] = useState<boolean>(false);
  const submitModal = () => setIsSubmitModal(true);
  const closeSubmitModal = () => setIsSubmitModal(false);
  const handleWordDataSubmit = () => {
    submitModal();
  };

  const handleSubmit = () => {
    closeSubmitModal();
    const results: WordTestRequestDto["results"] = [];

    quiz.forEach((_, index) => {
      const correctAnswer = data?.tests[index].word;
      const answer = userAnswers[index]?.toLowerCase().replace(/\s+/g, "");
      const wordTestData = {
        sentence: data!.tests[index].sentence,
        correctAnswer: correctAnswer!,
        answer: answer,
        isCorrect: correctAnswer === answer,
      };
      results.push(wordTestData);
    });
    const wordTestResultDataSet: WordTestRequestDto = {
      quizId: data!.quizId,
      results: results,
    };
    console.log(wordTestResultDataSet);

    mutation.mutate(wordTestResultDataSet);
  };

  if (isLoading) return <Spinner />;
  if (error)
    return <ErrorText>에러가 발생했습니다. 다시 시도해 주세요.</ErrorText>;

  return (
    <MainContainer>
      <PageInfo>
        {currentPage} / {Math.ceil(quiz.length / questionsPerPage)}
      </PageInfo>
      {currentQuestions.map((q, index) => {
        inputRefs.current[index] = [];
        return (
          <QuizContainer key={index}>
            <Question>
              {indexOfFirstQuestion + index + 1}.{" "}
              {q.question.split("_".repeat(q.answer.length))[0]}
              {q.answer.split("").map((_, i) => (
                <BlankInput
                  key={i}
                  type="text"
                  ref={(el) => (inputRefs.current[index][i] = el)}
                  value={userAnswers[indexOfFirstQuestion + index]?.[i] || ""}
                  onChange={(e) => handleInputChange(index, i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index, i)}
                  maxLength={1}
                />
              ))}
              {q.question.split("_".repeat(q.answer.length))[1]}
            </Question>
            <Translation>{q.translation}</Translation>
          </QuizContainer>
        );
      })}

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

      {currentPage === Math.ceil(quiz.length / questionsPerPage) && (
        <SubmitButtonContainer>
          <SubmitButton onClick={handleWordDataSubmit}>제출</SubmitButton>
        </SubmitButtonContainer>
      )}
      <Modal
        isOpen={isSubmitModal}
        onClose={closeSubmitModal}
        title="Speaking Test"
      >
        <p>정말로 제출하시겠습니까?</p>
        <ModalButtonContainer>
          <ModalCancelButton onClick={closeSubmitModal}>취소</ModalCancelButton>
          <ModalConfirmButton onClick={handleSubmit}>확인</ModalConfirmButton>
        </ModalButtonContainer>
      </Modal>
    </MainContainer>
  );
};

export default WordTestMobilePage;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  margin: auto;
  padding: 1rem;
  background-color: ${(props) => props.theme.colors.cardBackground};
  border-radius: 0.5rem;
  box-shadow: 0 4px 10px ${(props) => props.theme.colors.shadow};
`;

const PageInfo = styled.div`
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const QuizContainer = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  text-align: left;
`;

const Question = styled.div`
  font-size: 1rem;
  font-weight: bold;
  display: flex;
  align-items: center;
`;

const Translation = styled.div`
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const BlankInput = styled.input`
  width: 1.5rem;
  padding: 0.25rem;
  margin: 0 0.125rem;
  border: 1px solid ${(props) => props.theme.colors.primary};
  border-radius: 0.25rem;
  text-align: center;
  font-size: 1rem;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;

  &:focus {
    outline: none;
    box-shadow: 0 0 0.25rem ${(props) => props.theme.colors.primaryPress};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 1.5rem;
`;

const PageButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
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
  margin-top: 1.5rem;
`;

const SubmitButton = styled(PageButton)`
  background-color: ${(props) => props.theme.colors.primary};
  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }
`;

const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const ModalCancelButton = styled.button`
  padding: 0.5rem 1.5rem;
  background-color: ${(props) => props.theme.colors.placeholder};
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.colors.danger};
  }
`;
const ModalConfirmButton = styled.button`
  padding: 0.5rem 1.5rem;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }
`;

const ErrorText = styled.div`
  color: ${(props) => props.theme.colors.danger};
  font-size: 1.25rem;
  text-align: center;
`;


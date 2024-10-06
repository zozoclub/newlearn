import React, { useEffect, useState, useRef } from "react";
import { useSetRecoilState } from "recoil";
import locationState from "@store/locationState";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive"; // 모바일 여부 감지
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getWordTestList,
  postWordTestResult,
  WordTestListResponseDto,
  WordTestRequestDto,
  deleteWordTest
} from "@services/wordTestService";
import Spinner from "@components/Spinner";
import Modal from "@components/Modal";
import { isExpModalState } from "@store/expState";
import WordTestMobilePage from "./mobile/WordTestMobilePage";

const WordTestPage: React.FC = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [searchParams] = useSearchParams();
  const totalCount = searchParams.get("totalCount");
  const setExpModal = useSetRecoilState(isExpModalState);
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const mutation = useMutation({
    mutationFn: (wordTestResultDataSet: WordTestRequestDto) =>
      postWordTestResult(wordTestResultDataSet),
    onSuccess: () => {
      console.log("결과 전달 완료");
    },
  });

  const setCurrentLocation = useSetRecoilState(locationState);
  useEffect(() => {
    setCurrentLocation("Word Test Page");
  }, [setCurrentLocation]);

  const { isLoading, error: dataError, data } = useQuery<WordTestListResponseDto>({
    queryKey: ["wordTestData", Number(totalCount)],
    queryFn: () => getWordTestList(Number(totalCount)),
    refetchOnWindowFocus: false,
  });
  const quizId = data?.quizId
  console.log("퀴즈 아이디", quizId);

  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지
  const [quiz, setQuiz] = useState<
    { question: string; translation: string; answer: string }[]
  >([]);
  const [error, setError] = useState(false);

  // 데이터가 있을 때 퀴즈 생성
  useEffect(() => {
    if (data) {
      const processedQuiz = data.tests.map((item) => ({
        question: item.sentence.replace(item.word, "_".repeat(item.word.length)),
        translation: item.sentenceMeaning,
        answer: item.word,
      }));
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
  const currentQuestions = quiz.slice(indexOfFirstQuestion, indexOfLastQuestion);

  const handleInputChange = (
    index: number,
    subIndex: number,
    value: string
  ) => {
    const englishOnly = /^[a-zA-Z]*$/;
    if (!englishOnly.test(value)) {
      setError(true);
      return

    } else {
      setError(false);
    }

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
    setIsSubmit(true);
    submitModal();
  };

  const handleExitTest = async () => {
    if (quizId) {
      try {
        await deleteWordTest(quizId); // 중간에 퇴장 시 테스트 삭제
        navigate("/wordtesthistory"); // 퇴장 후 홈으로 이동
      } catch (error) {
        console.error("테스트 삭제 실패:", error);
      }
    }
  };

  // 뒤로 가기 방지 + 모달 로직
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (!isSubmit) { // 제출된 상태가 아닐 때만 뒤로 가기 방지
        event.preventDefault();
        setIsExitModalOpen(true); // 뒤로 가기 시 모달 띄우기
        window.history.pushState(null, "", window.location.href); // 현재 페이지로 다시 푸시
      }
    };

    window.history.pushState(null, "", window.location.href); // 페이지 진입 시 히스토리 상태 추가
    window.addEventListener("popstate", handlePopState); // 뒤로 가기 방지

    return () => {
      window.removeEventListener("popstate", handlePopState); // 컴포넌트 언마운트 시 이벤트 제거
    };
  }, [isSubmit]);

  const handleSubmit = () => {
    closeSubmitModal();
    const results: WordTestRequestDto["results"] = [];
    let correctAnswerCount = 0;

    quiz.forEach((_, index) => {
      const correctAnswer = data?.tests[index].word;
      const answer = userAnswers[index]?.toLowerCase().replace(/\s+/g, "");
      const isCorrect = correctAnswer === answer;
      if (isCorrect) correctAnswerCount += 1;

      const wordTestData = {
        sentence: data!.tests[index].sentence,
        correctAnswer: correctAnswer!,
        answer: answer,
        isCorrect: isCorrect,
      };
      results.push(wordTestData);
    });

    const experience = correctAnswerCount * 2;
    const wordTestResultDataSet: WordTestRequestDto = {
      quizId: data!.quizId,
      results: results,
    };

    mutation.mutate(wordTestResultDataSet, {
      onSuccess: () => {
        setExpModal({
          isOpen: true,
          experience: experience,
          action: "빈칸 단어 넣기",
        });
        navigate(`/word/result/${data!.quizId}`);
      },
    });
  };

  const answeredWordsCount = userAnswers.filter((ans) => ans.trim() !== "").length;

  // 로딩 상태 처리
  if (isLoading) return <Spinner />;

  // 에러 상태 처리
  if (dataError)
    return <ErrorText>에러가 발생했습니다. 다시 시도해 주세요.</ErrorText>;

  if (isMobile) return <WordTestMobilePage />;

  return (
    <MainContainer>
      {/* 테스트 퇴장 모달 */}
      <Modal isOpen={isExitModalOpen} onClose={() => setIsExitModalOpen(false)} title="테스트 퇴장">
        <p>테스트를 중단하고 나가시겠습니까?</p>
        <ModalButtonContainer>
          <ModalCancelButton onClick={() => setIsExitModalOpen(false)}>취소</ModalCancelButton>
          <ModalConfirmButton onClick={handleExitTest}>확인</ModalConfirmButton>
        </ModalButtonContainer>
      </Modal>
      <WordCount>
        입력된 단어수 {answeredWordsCount < quiz.length ? <InfoTextEmphasizeRed>{answeredWordsCount}</InfoTextEmphasizeRed> : <InfoTextEmphasizeBlue>{answeredWordsCount}</InfoTextEmphasizeBlue>}개, 전체 문제 수 <InfoTextNormal>{quiz.length}</InfoTextNormal>개
      </WordCount>

      {/* 문제 랜더링 */}
      <QuizLayout>
        {currentQuestions.map((q, index) => {
          inputRefs.current[index] = [];
          return (
            <QuizContainer key={index}>
              <QuestionBox>
                <Index>{indexOfFirstQuestion + index + 1}. </Index>
                <Question>
                  <div>
                    <BeforeText>
                      {q.question.split("_".repeat(q.answer.length))[0]}
                    </BeforeText>
                    <BlankInputContainer>
                      {q.answer.split("").map((_, i) => (
                        <BlankInput
                          key={i}
                          type="text"
                          ref={(el) => (inputRefs.current[index][i] = el)}
                          value={userAnswers[indexOfFirstQuestion + index]?.[i] || ""}
                          onChange={(e) =>
                            handleInputChange(index, i, e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(e, index, i)}
                          maxLength={1}
                        />
                      ))}
                    </BlankInputContainer>
                    <AfterText>
                      {q.question.split("_".repeat(q.answer.length))[1]}
                    </AfterText>
                  </div>
                  <Translation>{q.translation}</Translation>
                </Question>
              </QuestionBox>
            </QuizContainer>
          );
        })}
      </QuizLayout>

      <BottomContainer>
        {quiz.length > questionsPerPage && (
          <ButtonContainer>
            <PageButton onClick={handlePrevPage} disabled={currentPage === 1}>
              이전
            </PageButton>
            <PageInfo>
              {currentPage} / {Math.ceil(quiz.length / questionsPerPage)}
            </PageInfo>
            <PageButton
              onClick={handleNextPage}
              disabled={currentPage === Math.ceil(quiz.length / questionsPerPage)}
            >
              다음
            </PageButton>
          </ButtonContainer>
        )}
        {error && <ErrorMessage>영어만 입력 가능합니다</ErrorMessage>}
        <SubmitButtonContainer>
          {currentPage === Math.ceil(quiz.length / questionsPerPage) ? (
            <SubmitButton onClick={handleWordDataSubmit}>제출</SubmitButton>
          ) : <Empty />}
        </SubmitButtonContainer>
      </BottomContainer>
      <Modal isOpen={isSubmitModal} onClose={closeSubmitModal} title="Speaking Test">
        <p>정말로 제출하시겠습니까?</p>
        <ModalButtonContainer>
          <ModalCancelButton onClick={closeSubmitModal}>취소</ModalCancelButton>
          <ModalConfirmButton onClick={handleSubmit}>확인</ModalConfirmButton>
        </ModalButtonContainer>
      </Modal>
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
  background-color: ${(props) => props.theme.colors.cardBackground + "5A"};
  backdrop-filter: blur(0.25rem);
  border-radius: 0.75rem;
  box-shadow: ${(props) => props.theme.shadows.medium};
  transition: box-shadow 0.5s;
`;

const WordCount = styled.div`
  position: absolute;
  top: 3rem;
  left: 3rem;
  font-size: 1.2rem;
`;

const QuizLayout = styled.div`
  width: 95%;
  margin-top: 8rem;
`

const QuizContainer = styled.div`
  margin-bottom: 1.5rem;
  text-align: left;
`;

const Question = styled.div`
  display: flex;
  font-size: 1.375rem;
  font-weight: bold;
  align-items: center;
  flex-wrap: wrap;
`;

const Translation = styled.div`
  font-size: 1.125rem;
  font-weight: 400;
  margin-top: 0.75rem;
  margin-bottom: 0.5rem;
  color: ${(props) => props.theme.colors.text04};
  flex-basis: 100%;
`;

const BlankInput = styled.input`
  width: 0.875rem;
  padding: 0.5rem 0.25rem 0 0.25rem;
  margin: 0 0.125rem 0.125rem 0.125rem;
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
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin-bottom: 2rem;
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
  margin-bottom: 1rem;
`;

const SubmitButton = styled(PageButton)`
  background-color: ${(props) => props.theme.colors.primary};
  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }
`;

const Empty = styled.div`
  margin-top:3rem;
`

const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
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

const BlankInputContainer = styled.span`
  margin-left: 0.25rem;
  margin-right: 0.25rem;
  margin-bottom: 1rem;
`;

const BeforeText = styled.span`
  line-height: 1.5;
`;

const AfterText = styled.span`
  line-height: 1.5;
`;

const QuestionBox = styled.div`
  display: flex;
`;

const Index = styled.div`
  margin-top: 0.375rem;
  margin-right: 0.25rem;
  font-size: 1.5rem;
  font-weight: 500;
`;

const PageInfo = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
`;

const BottomContainer = styled.div`
  width: 100%;
  margin-top: 2rem;
`;

const ErrorMessage = styled.span`
display: flex;
justify-content:center;
margin-bottom: 1rem;
  color: ${(props) => props.theme.colors.danger};
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 0.5rem;
`;

const InfoTextEmphasizeRed = styled.span`
  margin-left: 0.25rem;
  margin-right: 0.25rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.danger};
  `;

const InfoTextEmphasizeBlue = styled.span`
  margin-right: 0.25rem;
  margin-left: 0.25rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
`;

const InfoTextNormal = styled.span`
  margin-right: 0.25rem;
  margin-left: 0.25rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
`;

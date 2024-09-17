import React, { useEffect, useState, useRef } from "react";
import { useSetRecoilState } from "recoil";
import locationState from "@store/locationState";
import styled from "styled-components";

const WordTestPage: React.FC = () => {
  const setCurrentLocation = useSetRecoilState(locationState);
  useEffect(() => {
    setCurrentLocation("Word Test Page");
  }, [setCurrentLocation]);

  // 퀴즈는 back에서 받는 형태로 변경 예정
  const quiz = [
    {
      question:
        "Every morning, Sarah ______ (walk) to the park and enjoys the fresh air.",
      translation:
        "매일 아침, 사라는 공원까지 걸어서 가며 신선한 공기를 즐긴다.",
      answer: "walks",
    },
    {
      question:
        "The cat is hiding ______ the table because it’s afraid of the thunder.",
      translation: "고양이는 천둥을 무서워해서 테이블 밑에 숨고 있다.",
      answer: "under",
    },
    {
      question:
        "He wanted to go to the party, ______ he was too tired after work.",
      translation: "그는 파티에 가고 싶었지만, 일 후에 너무 피곤했다.",
      answer: "but",
    },
    {
      question: "She has been living in this city ______ five years.",
      translation: "그녀는 이 도시에 5년째 살고 있다.",
      answer: "for",
    },
    {
      question: "It ______ (rain) when I left the house this morning.",
      translation: "오늘 아침 내가 집을 나설 때 비가 오고 있었다.",
      answer: "was raining",
    },
    {
      question: "We need to leave early ______ we miss the train.",
      translation: "우리는 기차를 놓치지 않기 위해 일찍 떠나야 한다.",
      answer: "so that",
    },
    {
      question: "John ______ (not/finish) his homework yet.",
      translation: "John은 아직 숙제를 끝내지 못했다.",
      answer: "has not finished",
    },
    {
      question: "The movie was really boring, ______ we left early.",
      translation: "그 영화는 정말 지루해서 우리는 일찍 나갔다.",
      answer: "so",
    },
    {
      question: "If I ______ (be) you, I would take that job offer.",
      translation: "내가 너라면, 그 일자리를 수락하겠어.",
      answer: "were",
    },
  ];

  const [userAnswers, setUserAnswers] = useState<string[]>(
    Array(quiz.length).fill("")
  );
  const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지

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
  width: 0.875rem; // 빈칸의 크기 설정 (한 글자씩)
  padding: 0.25rem;
  margin: 0 0.125rem;
  border: 1px solid ${(props) => props.theme.colors.primary};
  border-radius: 0.25rem;
  text-align: center;
  font-size: 1.125rem;
  background-color: ${(props) => props.theme.colors.primary};
  color: white; // 텍스트 색상

  &:focus {
    outline: none;
    box-shadow: 0 0 0.25rem ${(props) => props.theme.colors.primaryHover};
  }

  &:hover {
    cursor: text;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
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
    background-color: ${(props) => props.theme.colors.primaryHover};
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
    background-color: ${(props) => props.theme.colors.primaryHover};
  }
`;

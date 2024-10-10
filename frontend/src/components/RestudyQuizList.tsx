import React, { useState } from "react";
import styled from "styled-components";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  postSaveForgettingCurveWord,
  SaveForgettingCurveWordRequestDto,
  ForgettingCurveWordListResponseDto,
  postSkipCurveWord,
} from "@services/forgettingCurve";
import { words } from "@utils/words";

type RestudyQuizListProps = {
  onClose: () => void;
  newRestudyData: ForgettingCurveWordListResponseDto[];
};

type ResultData = {
  question: ForgettingCurveWordListResponseDto;
  selectedAnswer: string;
  correctAnswer: string;
  correctMeaning: string;
  isCorrect: boolean;
};

const RestudyQuizList: React.FC<RestudyQuizListProps> = ({
  onClose,
  newRestudyData,
}) => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState<ResultData[]>([]); // 문제 결과 저장
  const [results, setResults] = useState<SaveForgettingCurveWordRequestDto[]>(
    []
  );
  const [skippedWords, setSkippedWords] = useState<number[]>([]);
  const [options, setOptions] = useState<string[][]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [updatedLevel, setUpdatedLevel] = useState<number | null>(null);
  const remainingQuestions = newRestudyData!.length - currentPage;

  // 정답 및 오답을 랜덤으로 생성하는 함수
  const generateOptions = (correctAnswer: string) => {
    const incorrectAnswers = words
      .filter((word) => word.word !== correctAnswer)
      .map((word) => word.word)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    return [...incorrectAnswers, correctAnswer].sort(() => 0.5 - Math.random());
  };

  // 현재 문제의 선택지 생성 및 저장
  const initializeOptions = (
    newRestudyData: ForgettingCurveWordListResponseDto[]
  ) => {
    const generatedOptions = newRestudyData.map((question) =>
      generateOptions(question.word)
    );
    setOptions(generatedOptions);
  };

  // 최종 결과 제출 Mutation
  const submitResultsMutation = useMutation({
    mutationFn: (saveData: SaveForgettingCurveWordRequestDto[]) =>
      postSaveForgettingCurveWord(saveData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forgettingCurveQuestions"] });
    },
  });

  // 모두 스킵 버튼 클릭 시 호출되는 함수
  const handleSkipAll = () => {
    const remainingQuestions = newRestudyData!
      .slice(currentPage)
      .map((question) => ({
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

  const fullProcessMeaning = (meaning: string) => {
    return meaning.split("//").map((line, index) => (
      <span key={index}>
        {index + 1}. {line}
        <br />
      </span>
    ));
  };

  const handleAnswerSelection = (
    selectedAnswer: string,
    question: ForgettingCurveWordListResponseDto
  ) => {
    const isCorrect = selectedAnswer === question.word;
    setSelectedOption(selectedAnswer); // 선택한 답 저장
    setCorrectAnswer(question.word); // 정답 저장

    if (isCorrect) {
      // 정답일 경우 기존 레벨 유지
      setScore((prevScore) => prevScore + 1);
      setUpdatedLevel(question.wordNowLevel);
    } else {
      // 오답일 경우 레벨을 -1 감소시키지만 최소 레벨은 1로 유지
      setUpdatedLevel(1);
    }

    // 문제 결과 저장
    const resultData: ResultData = {
      question,
      selectedAnswer,
      correctAnswer: question.word,
      correctMeaning: question.wordMeaning,
      isCorrect,
    };
    setShowResults((prevResults) => [...prevResults, resultData]);

    setShowDetails(true); // 정답 선택 후 세부 정보 표시

    setTimeout(() => {
      // 1초 후 다음 문제로 넘어감
      setShowDetails(false); // 세부 정보 숨김
      setSelectedOption(null); // 선택된 옵션 초기화
      setCorrectAnswer(null); // 정답 초기화
      if (currentPage === newRestudyData!.length - 1) {
        const updatedResults = [
          ...results,
          {
            wordId: question.wordId,
            isDoing: true,
            isCorrect: isCorrect,
          },
        ];
        setResults(updatedResults);
        const filteredResults = updatedResults.filter(
          (result) => !skippedWords.includes(result.wordId)
        );
        submitResultsMutation.mutate(filteredResults, {
          onSuccess: () => {
            setCurrentPage(newRestudyData!.length);
          },
        });
      } else {
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
    }, 1000); // 1초 후 다음 페이지로 이동
  };

  // 레벨에 따른 메시지 표시 함수
  const getLevelMessage = (level: number) => {
    switch (level) {
      case 1:
        return "3일 뒤 출제됩니다.";
      case 2:
        return "7일 뒤 출제됩니다.";
      case 3:
        return "30일 뒤 출제됩니다.";
      case 4:
        return "60일 뒤 출제됩니다.";
      case 5:
        return "완벽합니다!";
      default:
        return "1일 뒤 출제됩니다.";
    }
  };

  // 문제 스킵 시 호출되는 함수
  const handleSkip = async (question: ForgettingCurveWordListResponseDto) => {
    await postSkipCurveWord(question.wordId);
    setSkippedWords((prev) => [...prev, question.wordId]);

    // 마지막 문제인지 확인
    const isLastQuestion = currentPage === newRestudyData!.length - 1;

    if (isLastQuestion) {
      // 마지막 문제일 경우 즉시 결과를 제출
      const updatedResults = [
        ...results,
        {
          wordId: question.wordId,
          isDoing: false,
          isCorrect: false,
        },
      ];
      const filteredResults = updatedResults.filter(
        (result) => !skippedWords.includes(result.wordId)
      );

      submitResultsMutation.mutate(filteredResults, {
        onSuccess: () => {
          setCurrentPage(newRestudyData!.length);
        },
      });
    } else {
      // 마지막 문제가 아닌 경우 다음 문제로 이동
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleQuizExit = () => {
    onClose();
  };

  const getButtonColor = (option: string) => {
    if (selectedOption) {
      if (option === correctAnswer) {
        return "#0268ed"; // 정답 파란색
      } else if (option === selectedOption) {
        return "#ff4e50"; // 선택한 오답 빨간색
      }
    }
    return "#cccccc"; // 기본 색상
  };

  const getButtonTest = (option: string) => {
    if (selectedOption) {
      if (option === correctAnswer) {
        return "white";
      } else if (option === selectedOption) {
        return "white";
      }
    }
    return "black"; // 기본 색상
  };

  // 서버에서 문제가 없을 때 처리
  if (newRestudyData.length === 0)
    return <ErrorText>문제를 불러오는 데 실패했습니다.</ErrorText>;

  if (options.length === 0 && newRestudyData && newRestudyData.length > 0) {
    initializeOptions(newRestudyData);
  }

  return (
    <Container>
      <ModalRightHeader>
        {currentPage < newRestudyData.length && (
          <>
            <RemainingQuestions>{`남은 문항: ${remainingQuestions}`}</RemainingQuestions>
            <SkipAllButton onClick={handleSkipAll}>미루기</SkipAllButton>
          </>
        )}
      </ModalRightHeader>

      <QuizContainer $currentPage={currentPage}>
        {newRestudyData!.map((question, index) => (
          <React.Fragment key={`fragment-${index}`}>
            <QuestionWrapper
              key={`question-${index}`}
              $currentPage={currentPage}
              $index={index}
            >
              <QuizWrapper>
                {/* 레벨 메시지 표시 */}
                <QuestionText>
                  <LevelMessage>
                    {question.wordNowLevel === 2
                      ? "3일 전에 출제됐어요."
                      : question.wordNowLevel === 3
                      ? "7일 전에 출제됐어요."
                      : question.wordNowLevel === 4
                      ? "30일 전에 출제됐어요."
                      : question.wordNowLevel === 5
                      ? "60일 전에 출제됐어요."
                      : ""}
                  </LevelMessage>
                  {question.sentence.replace(question.word, "_______")}
                </QuestionText>
                <SentenceMeaning>{`${question.sentenceMeaning}`}</SentenceMeaning>
                <OptionsWrapper>
                  {options[index]?.map((option, idx) => (
                    <OptionButton
                      key={`option-${index}-${idx}`}
                      onClick={() => handleAnswerSelection(option, question)}
                      style={{
                        backgroundColor: getButtonColor(option),
                        color: getButtonTest(option),
                      }}
                    >
                      {option}
                    </OptionButton>
                  ))}
                </OptionsWrapper>
              </QuizWrapper>
            </QuestionWrapper>
            {currentPage !== newRestudyData.length && (
              <NextButton
                key={`next-button-${index}`}
                onClick={() => handleSkip(question)}
                disabled={showDetails}
              >
                {
                  selectedOption === null
                    ? "Skip"
                    : selectedOption === correctAnswer // 정답을 맞췄을 경우
                    ? getLevelMessage(updatedLevel!)
                    : "1일 뒤 출제됩니다." // 틀렸을 경우 1일 뒤 출제
                }
              </NextButton>
            )}
          </React.Fragment>
        ))}

        <QuestionWrapper
          $currentPage={currentPage}
          $index={newRestudyData.length}
        >
          <ResultPage>
            {results.length ? (
              <>
                <ResultText>{`${newRestudyData.length}문제 중 ${score}문제 맞혔습니다.`}</ResultText>
                <ResultSkipText>
                  Skip한 문제는 다음 날 등장합니다.
                </ResultSkipText>
              </>
            ) : (
              <>
                <ResultSkipTitle>모든 문제를 Skip 했습니다.</ResultSkipTitle>
                <ResultSkipText>
                  Skip한 문제는 다음 날 등장합니다.
                </ResultSkipText>
              </>
            )}
            <ScrollableResultContainer>
              {showResults.map((result, index) => (
                <ResultCard key={index}>
                  <AnswerReview>
                    {`${index + 1}번 `}
                    <AnswerStatus $isCorrect={result.isCorrect}>
                      {result.isCorrect ? "정답" : "오답"}
                    </AnswerStatus>
                  </AnswerReview>
                  <AnswerText>{`${result.question.sentence}`}</AnswerText>
                  <AnswerText>{`정답 : ${result.correctAnswer}`}</AnswerText>
                  <AnswerMeanText>
                    {fullProcessMeaning(result.correctMeaning)}
                  </AnswerMeanText>
                  <AnswerText>{`내가 선택한 답 : ${result.selectedAnswer}`}</AnswerText>
                </ResultCard>
              ))}
            </ScrollableResultContainer>
          </ResultPage>
        </QuestionWrapper>
      </QuizContainer>
      {currentPage === newRestudyData.length && (
        <EndButton onClick={handleQuizExit}>종료</EndButton>
      )}
    </Container>
  );
};

export default RestudyQuizList;

const SkipAllButton = styled.button`
  top: 2rem;
  right: 3rem;
  background-color: ${({ theme }) => theme.colors.danger};
  color: white;
  padding: 0.625rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: transform 0.2s ease-in-out, background-color 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.dangerPress};
  }

  &:active {
    transform: translateY(0);
  }
  @media (max-width: 1280px) {
    top: 1rem;
    right: 2rem;
  }
  @media (max-width: 768px) {
    top: 0.5rem;
    right: 1rem;
    padding: 0.375rem 1rem;
    font-size: 0.75rem;
  }
`;

const QuizContainer = styled.div<{ $currentPage: number }>`
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

const ModalRightHeader = styled.div`
  position: absolute;
  display: flex;
  top: 1.5rem;
  right: 2rem;
  align-items: center;
  gap: 2rem;
  @media (max-width: 1280px) {
    top: 1rem;
    right: 2rem;
  }
  @media (max-width: 768px) {
    top: 1.5rem;
    right: 1rem;
    padding: 0.375rem 1rem;
    gap: 1rem;
  }
`;

const QuestionWrapper = styled.div<{ $currentPage: number; $index: number }>`
  position: absolute;
  width: 100%;
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
  width: 100%;
  max-height: 40vh; /* 전체 높이를 줄이기 위해 max-height 설정 */
  padding: 0 1.25rem;
  border-radius: 1rem;
  overflow-y: auto; /* 내용이 길 경우 세로 스크롤 추가 */
`;

const QuestionText = styled.p`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 2rem;
  margin-bottom: 1rem;
  line-height: 1.2;
  letter-spacing: 0.3px;
  @media (max-width: 1280px) {
    font-size: 1.25rem;
    line-height: 1.1;
    margin-top: 1.5rem;
  }
  @media (max-width: 768px) {
    font-size: 1.125rem;
    margin-top: 0rem;
  }
`;

const OptionsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1rem;
  justify-items: center;
  margin-top: 2rem;
`;

const OptionButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 1px solid #cccccc;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1.25rem;
  font-weight: bold;
  width: 100%;
  text-align: center;
  color: black;
  letter-spacing: 0.5px;
  @media (max-width: 1280px) {
    font-size: 1.125rem;
  }
  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 0.625rem 0.875rem;
  }
`;

const EndButton = styled.button`
  margin-bottom: 1.75rem;
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  border: none;
  background-color: #42b883;
  color: white;
  font-size: 1.125rem;
  font-weight: bold;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: #38a76d;
  }

  &:active {
    background-color: #2c8f5e;
  }
  @media (max-width: 1280px) {
    font-size: 1rem;
  }
`;

const NextButton = styled.button`
  position: absolute; /* 버튼을 QuizWrapper 하단에 고정 */
  bottom: 1rem; /* 하단에서 1rem 위로 띄움 */
  left: 50%; /* 가로 중앙 정렬 */
  transform: translateX(-50%); /* 가로 중앙 정렬을 위한 transform */
  width: 12rem;
  padding: 0.75rem 1.5rem;
  border: none;
  background-color: #42b883;
  color: white;
  font-size: 1.125rem;
  font-weight: bold;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: #38a76d;
  }

  &:active {
    background-color: #2c8f5e;
  }

  @media (max-width: 1280px) {
    font-size: 1rem;
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
  padding: 0 2rem;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  @media (max-width: 768px) {
    padding: 0 0.875rem;
  }
`;

const ResultSkipTitle = styled.div`
  font-size: 2rem;
  font-weight: 700;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: 1rem;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  @media (max-width: 768px) {
    padding: 0 0.875rem;
    font-size: 1.5rem;
  }
`;
const ResultSkipText = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text04};
  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const ResultText = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1.5rem;
  text-align: center;
  @media (max-width: 1280px) {
    font-size: 1.375rem;
  }
  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
`;

const SentenceMeaning = styled.span`
  font-size: 1.25rem;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.text04};
  margin-bottom: 0.25rem;
  @media (max-width: 1280px) {
    font-size: 1.125rem;
    line-height: 1.3;
  }
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ErrorText = styled.p`
  font-size: 1.5rem;
  text-align: center;
  color: #ff4e50;
  margin-top: 2rem;
  @media (max-width: 1280px) {
    font-size: 1.375rem;
  }
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 50vh;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    height: 50vh;
  }
`;

const ScrollableResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
  width: 100%;
  max-height: 20rem;
  overflow-y: auto;
  padding-right: 1rem;
`;

const ResultCard = styled.div`
  letter-spacing: 0.1px;
  line-height: 1.3;
  background-color: ${({ theme }) => theme.colors.newsItemBackground};
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const AnswerStatus = styled.span<{ $isCorrect: boolean }>`
  color: ${({ $isCorrect, theme }) =>
    $isCorrect ? theme.colors.primary : theme.colors.danger};
  font-weight: bold;
  font-size: 1.25rem;
  @media (max-width: 1280px) {
    font-size: 1.125rem;
  }
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const AnswerText = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.text};
  margin: 0.25rem 0;
  @media (max-width: 1280px) {
    font-size: 1rem;
  }
  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const AnswerReview = styled.p`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textDark};
  @media (max-width: 1280px) {
    font-size: 1.125rem;
  }
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const AnswerMeanText = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text04};
  @media (max-width: 1280px) {
    font-size: 0.875rem;
  }
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;
const RemainingQuestions = styled.div`
  margin-top: 0.25rem;
  text-align: center;
  font-size: 1.25rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text04};
  @media (max-width: 1280px) {
    font-size: 0.875rem;
  }
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const LevelMessage = styled.span`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.primary};
  @media (max-width: 1280px) {
    font-size: 0.875rem;
  }
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;


import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import {
  extractWords,
  countWordFrequencies,
  getTopWords,
} from "@components/WordProcessor";
import { createGrid } from "@components/WordGridCreator";
import {
  handleMouseDown,
  handleMouseOver,
  handleMouseUp,
} from "@components/WordMouseHandlers";
import Modal from "./Modal";
import { isExpModalState } from "@store/expState";
import { putExpUp } from "@services/userService";
import { useSetRecoilState } from "recoil";

type EngDataProps = {
  engData?: string; // 긴 문단 형태로 string
};

const WordHunt: React.FC<EngDataProps> = ({ engData }) => {
  const text =
    engData ||
    `Facing mounting pressure following a contentious draw against Palestine in their most recent World Cup qualifier, South Korea's national football team has arrived in Oman, their next destination in the arduous quest for a coveted spot in the 2026 FIFA World Cup. In a somber press conference upon their arrival in Muscat, Head Coach Hong Myung-bo acknowledged the palpable frustration of the South Korean fan base, acknowledging the criticism directed at both the team's performance and the Korean Football Association's overall direction.
    While expressing empathy for the fans' disillusionment, Hong Myung-bo asserted that he would bear the brunt of the criticism, urging the public to rally behind the players, who he believes are striving to overcome adversity and deliver a strong performance on the pitch. Hong Myung-bo's plea for fan support comes amidst mounting controversy surrounding the national team's recent performance, with questions arising regarding the team's tactical approach and player selection.
    The match against Oman, scheduled for October 10th at the Sultan Qaboos Sports Complex, holds significant weight in South Korea's qualification hopes, as a victory would be crucial to maintaining momentum in Group B. Hong Myung-bo's words, imbued with a mixture of introspection and determination, reflect the immense pressure facing the South Korean squad as they embark on this critical juncture in their World Cup qualifying journey.`;

  const setExpModal = useSetRecoilState(isExpModalState);
  const [grid, setGrid] = useState<string[][]>([]);
  const [selectedPositions, setSelectedPositions] = useState<
    [number, number][]
  >([]);
  const [incorrectSelection, setIncorrectSelection] = useState<boolean>(false);
  const [placedWords, setPlacedWords] = useState<string[]>([]);
  const [placedWordPositions, setPlacedWordPositions] = useState<
    { word: string; positions: [number, number][] }[]
  >([]);
  const [correctSelections, setCorrectSelections] = useState<
    [number, number][]
  >([]);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCheckModal, setIsCheckModal] = useState<boolean>(false);
  const [correctWords, setCorrectWords] = useState<string[]>([]);
  const [correctWordsCount, setCorrectWordsCount] = useState<number>(0);

  const resetState = () => {
    setGrid([]);
    setSelectedPositions([]);
    setIncorrectSelection(false);
    setPlacedWords([]);
    setPlacedWordPositions([]);
    setCorrectSelections([]);
    setShowAnswer(false);
    setIsDisabled(false);
    setErrorMessage(null);
    setIsCheckModal(false);
    setCorrectWords([]);
    setCorrectWordsCount(0);
  };

  useEffect(() => {
    resetState();
  }, [engData]);

  // useMemo를 사용해 text 변경 시에만 단어 처리
  const processedWords = useMemo(() => {
    const words = extractWords(text);
    const wordCounts = countWordFrequencies(words);
    return getTopWords(wordCounts, 10);
  }, [text]);

  useEffect(() => {
    if (processedWords.length < 10) {
      setErrorMessage("WordHunt 단어가 부족합니다"); // 단어가 부족할 때 처리
      return;
    }

    const { grid, wordPositions, placedWords } = createGrid(processedWords, 12); // 그리드 생성
    setGrid(grid);
    setPlacedWordPositions(wordPositions);
    setPlacedWords(placedWords); // 성공적으로 배치된 단어만 설정
    setErrorMessage(null); // 에러 메시지 초기화
  }, [processedWords]);

  useEffect(() => {
    if (correctWordsCount > 0) {
      const exp = {
        isOpen: true,
        experience: 2,
        action: "Word Hunt",
      };
      putExpUp(2, setExpModal, exp.action);
    }
  }, [correctWordsCount, setExpModal]);

  const handleMouseLeaveGrid = () => {
    if (selectedPositions.length > 0) {
      setIncorrectSelection(true); // 틀린 선택 처리
      setIsDisabled(true); // 드래그 비활성화
      setTimeout(() => {
        setIncorrectSelection(false);
        setSelectedPositions([]); // 선택 초기화
        setIsDisabled(false); // 다시 활성화
      }, 1000);
    }
  };

  const handleSubmitConfirm = () => {
    setShowAnswer(true);
    setIsDisabled(true);
    setIsCheckModal(false);
  };

  const updateCorrectWord = (selectedWord: string) => {
    setCorrectWords((prev) => [...prev, selectedWord]);
  };

  const closeSubmitModal = () => {
    setIsCheckModal(false);
  };

  const handleShowAnswerClick = () => {
    setIsCheckModal(true);
  };

  if (errorMessage) {
    return (
      <ErrorMessage>WordHunt 단어가 부족합니다. 다른 기사로 시도해보세요!</ErrorMessage>
    )
  }

  return (
    <>
      <CustomhrTag />
      <Container>
        <Title>Word Hunt Game</Title>
        <Explain>
          왼쪽에 주어진 단어 리스트를 게임판에서 찾아 드래그 해보세요.
        </Explain>
        <WordHuntLayout>
          <WordList>
            <h2>Word List</h2>
            <p>
              Number of words remaining:{" "}
              {placedWords.length - correctWords.length}
            </p>
            <ul>
              {placedWords.map((word, index) => (
                <WordItem key={index} $isCorrect={correctWords.includes(word) || correctWords.includes(word.split("").reverse().join(""))}>
                  {word}
                </WordItem>
              ))}
            </ul>
          </WordList>
          <GridContainer onMouseLeave={handleMouseLeaveGrid}>
            <Grid>
              {grid.map((row, rowIndex) =>
                row.map((letter, colIndex) => {
                  const isSelected = selectedPositions.some(
                    ([r, c]) => r === rowIndex && c === colIndex
                  );
                  const isCorrect = correctSelections.some(
                    ([r, c]) => r === rowIndex && c === colIndex
                  );
                  const isIncorrect =
                    incorrectSelection && isSelected && !isCorrect;
                  const isAnswer =
                    showAnswer &&
                    placedWordPositions.some(({ positions }) =>
                      positions.some(
                        ([r, c]) => r === rowIndex && c === colIndex
                      )
                    );

                  return (
                    <Cell
                      key={`${rowIndex}-${colIndex}`}
                      $isSelected={isSelected}
                      $isCorrect={isCorrect}
                      $isIncorrect={isIncorrect}
                      $isAnswer={isAnswer}
                      onMouseDown={() =>
                        !isDisabled &&
                        handleMouseDown(
                          rowIndex,
                          colIndex,
                          setSelectedPositions,
                          setIncorrectSelection,
                          isDisabled,
                          correctSelections
                        )
                      }
                      onMouseOver={() =>
                        !isDisabled &&
                        handleMouseOver(
                          rowIndex,
                          colIndex,
                          selectedPositions,
                          setSelectedPositions,
                          isDisabled,
                          grid
                        )
                      }
                      onMouseUp={() =>
                        !isDisabled &&
                        handleMouseUp(
                          grid,
                          selectedPositions,
                          placedWordPositions,
                          setCorrectSelections,
                          setIncorrectSelection,
                          setSelectedPositions,
                          setIsDisabled,
                          updateCorrectWord,
                          setCorrectWordsCount
                        )
                      }
                    >
                      {letter}
                    </Cell>
                  );
                })
              )}
            </Grid>
          </GridContainer>
        </WordHuntLayout>
        <ButtonLayout>
          <Button onClick={handleShowAnswerClick} disabled={showAnswer}>
            {showAnswer ? `You Got ${correctWordsCount} Words` : "Show Answer"}
          </Button>
        </ButtonLayout>
        <Modal
          isOpen={isCheckModal}
          onClose={closeSubmitModal}
          title="Word Hunt"
        >
          <p>정답을 보게 되면 더이상 점수를 얻을 수 없습니다.</p>
          <ModalButtonContainer>
            <ModalCancelButton onClick={closeSubmitModal}>
              취소
            </ModalCancelButton>
            <ModalConfirmButton onClick={handleSubmitConfirm}>
              확인
            </ModalConfirmButton>
          </ModalButtonContainer>
        </Modal>
      </Container>
    </>
  );
};

export default WordHunt;

const Container = styled.div`
  user-select: none; /* 드래그 방지 */
`;

const Title = styled.div`
  width: 100%;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  font-family: "Righteous";
`;

const ButtonLayout = styled.div`
  display: flex;
  margin: 1rem 0;
  justify-content: center;
`;

const Button = styled.button<{ disabled: boolean }>`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  margin: 0.5rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryHover};
  }
`;

const WordHuntLayout = styled.div`
  display: flex;
  justify-content: center;
`;

const WordList = styled.div`
  margin-top: 1rem;
  text-align: left;
  width: 100%;
  max-width: 400px;
  h2 {
    font-size: 1.5rem;
    margin: 2rem 0;
    text-align: center;
    font-family: "Righteous";
  }
  p {
    margin-bottom: 2rem;
    text-align: center;
    color: ${(props) => props.theme.colors.placeholder};
  }
  ul {
    list-style: none;
    font-size: 1.125rem;
    text-align: center;
  }
`;

const GridContainer = styled.div`
  margin-top: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 2.5rem);
`;

const Cell = styled.div<{
  $isSelected: boolean;
  $isCorrect: boolean;
  $isIncorrect: boolean;
  $isAnswer: boolean;
}>`
  font-family: "Righteous";
  text-align: center;
  line-height: 2.5rem;
  background-color: ${(props) =>
    props.$isAnswer
      ? props.theme.colors.primary
      : props.$isCorrect
        ? props.theme.colors.primary
        : props.$isIncorrect
          ? props.theme.colors.danger
          : props.$isSelected
            ? "yellow"
            : props.theme.colors.cardBackground01};
  color: ${(props) =>
    props.$isCorrect || props.$isIncorrect || props.$isAnswer
      ? "white"
      : props.theme.colors.text};
  border: 1px solid ${(props) => props.theme.colors.primaryPress}AA;
  border-radius: 0.25rem;
  cursor: pointer;
`;

const WordItem = styled.li<{ $isCorrect: boolean }>`
  margin-bottom: 1.25rem;
  color: ${(props) =>
    props.$isCorrect ? props.theme.colors.primary : props.theme.colors.text};
  font-family: "Righteous";
`;

const Explain = styled.div`
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.125rem;
  color: ${(props) => props.theme.colors.text04};
`;

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

const CustomhrTag = styled.hr`
  border-bottom: 1px solid ${(props) => props.theme.colors.placeholder};
  margin: 3rem 0.1rem;
`;

const ErrorMessage = styled.div`
  margin-top: 5rem;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.125rem;
  color: ${(props) => props.theme.colors.text04};
`
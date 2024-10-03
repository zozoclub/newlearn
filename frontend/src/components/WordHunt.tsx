import React, { useEffect, useState } from "react";
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

type EngDataProps = {
  engData?: string; // 긴 문단 형태로 string
};

const WordHunt: React.FC<EngDataProps> = ({ engData }) => {
  // 전달받은 문자열을 text로 설정 (없으면 기본 값)
  const text = engData ||
    `Facing mounting pressure following a contentious draw against Palestine in their most recent World Cup qualifier, South Korea's national football team has arrived in Oman, their next destination in the arduous quest for a coveted spot in the 2026 FIFA World Cup. In a somber press conference upon their arrival in Muscat, Head Coach Hong Myung-bo acknowledged the palpable frustration of the South Korean fan base, acknowledging the criticism directed at both the team's performance and the Korean Football Association's overall direction.
    While expressing empathy for the fans' disillusionment, Hong Myung-bo asserted that he would bear the brunt of the criticism, urging the public to rally behind the players, who he believes are striving to overcome adversity and deliver a strong performance on the pitch. Hong Myung-bo's plea for fan support comes amidst mounting controversy surrounding the national team's recent performance, with questions arising regarding the team's tactical approach and player selection.
    The match against Oman, scheduled for October 10th at the Sultan Qaboos Sports Complex, holds significant weight in South Korea's qualification hopes, as a victory would be crucial to maintaining momentum in Group B. Hong Myung-bo's words, imbued with a mixture of introspection and determination, reflect the immense pressure facing the South Korean squad as they embark on this critical juncture in their World Cup qualifying journey.`

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

  useEffect(() => {
    const handleExtractWords = () => {
      const words = extractWords(text); // 단어 추출
      const wordCounts = countWordFrequencies(words);
      const topWords = getTopWords(wordCounts, 10); // 빈도수가 높은 10개 단어 추출

      if (topWords.length < 10) {
        setErrorMessage("WordHunt 단어가 부족합니다"); // 단어가 부족할 때 처리
        return;
      }

      const { grid, wordPositions } = createGrid(topWords, 12); // 그리드 생성
      setGrid(grid);
      setPlacedWordPositions(wordPositions);
      setPlacedWords(topWords);
      setErrorMessage(null); // 에러 메시지 초기화
    };

    handleExtractWords(); // 컴포넌트가 마운트될 때 실행
  }, [text]);

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

  if (errorMessage) {
    return <ErrorText>{errorMessage}</ErrorText>;
  }

  return (
    <Container>
      <Title>Word Hunt</Title>
      <Button onClick={() => setShowAnswer(!showAnswer)}>
        {showAnswer ? "Hide Answer" : "Show Answer"}
      </Button>

      <WordList>
        <h2>Placed Words:</h2>
        <ul>
          {placedWords.map((word, index) => (
            <li key={index}>{word}</li>
          ))}
        </ul>
      </WordList>
      <GridContainer onMouseLeave={handleMouseLeaveGrid}>
        <h2>12x12 Grid:</h2>
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
                  positions.some(([r, c]) => r === rowIndex && c === colIndex)
                );

              return (
                <Cell
                  key={`${rowIndex}-${colIndex}`}
                  $isSelected={isSelected}
                  $isCorrect={isCorrect}
                  $isIncorrect={isIncorrect}
                  $isAnswer={isAnswer}
                  onMouseDown={() =>
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
                    handleMouseUp(
                      grid,
                      selectedPositions,
                      placedWordPositions,
                      setCorrectSelections,
                      setIncorrectSelection,
                      setSelectedPositions,
                      setIsDisabled
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
    </Container>
  );
};

export default WordHunt;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  user-select: none; /* 드래그 방지 */
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  margin: 0.5rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryHover};
  }
`;

const WordList = styled.div`
  margin-top: 1rem;
  text-align: left;
  width: 100%;
  max-width: 400px;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  ul {
    list-style: none;
    padding: 0;
    font-size: 1.125rem;

    li {
      padding: 0.25rem 0;
    }
  }
`;

const GridContainer = styled.div`
  margin-top: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 2rem);
`;

const Cell = styled.div<{
  $isSelected: boolean;
  $isCorrect: boolean;
  $isIncorrect: boolean;
  $isAnswer: boolean;
}>`
  text-align: center;
  line-height: 2rem;
  background-color: ${(props) =>
    props.$isAnswer
      ? props.theme.colors.primary
      : props.$isCorrect
        ? props.theme.colors.primary
        : props.$isIncorrect
          ? props.theme.colors.danger
          : props.$isSelected
            ? "yellow"
            : "white"};
  color: ${(props) =>
    props.$isCorrect || props.$isIncorrect || props.$isAnswer
      ? "white"
      : "black"};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 0.25rem;
  cursor: pointer;
`;

const ErrorText = styled.p`
  font-size: 1.5rem;
  color: ${(props) => props.theme.colors.danger};
  text-align: center;
  margin-top: 2rem;
`;

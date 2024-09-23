import React, { useState } from "react";
import styled from "styled-components";

const WordHunt: React.FC = () => {
  const text = [
    "Facing mounting pressure following a contentious draw against Palestine in their most recent World Cup qualifier, South Korea's national football team has arrived in Oman, their next destination in the arduous quest for a coveted spot in the 2026 FIFA World Cup.",
    "In a somber press conference upon their arrival in Muscat, Head Coach Hong Myung-bo acknowledged the palpable frustration of the South Korean fan base, acknowledging the criticism directed at both the team's performance and the Korean Football Association's overall direction.",
    "While expressing empathy for the fans' disillusionment, Hong Myung-bo asserted that he would bear the brunt of the criticism, urging the public to rally behind the players, who he believes are striving to overcome adversity and deliver a strong performance on the pitch.",
    "Hong Myung-bo's plea for fan support comes amidst mounting controversy surrounding the national team's recent performance, with questions arising regarding the team's tactical approach and player selection.",
    "The match against Oman, scheduled for October 10th at the Sultan Qaboos Sports Complex, holds significant weight in South Korea's qualification hopes, as a victory would be crucial to maintaining momentum in Group B.",
    "Hong Myung-bo's words, imbued with a mixture of introspection and determination, reflect the immense pressure facing the South Korean squad as they embark on this critical juncture in their World Cup qualifying journey.",
  ];

  const extractWords = (textArray: string[]) => {
    const text = textArray.join(" ");
    const words = text.match(/\b\w+\b/g);
    const stopWordsSet = new Set([
      "the",
      "and",
      "is",
      "in",
      "on",
      "at",
      "of",
      "a",
      "to",
      "for",
      "with",
      "as",
      "by",
      "this",
      "that",
      "it",
      "they",
      "their",
      "them",
      "his",
      "her",
      "he",
      "she",
      "i",
      "you",
      "we",
      "us",
      "me",
      "my",
      "your",
      "its",
      "our",
      "those",
      "these",
      "who",
      "whom",
      "which",
      "what",
      "when",
      "where",
      "why",
      "how",
      "some",
      "any",
      "no",
      "all",
      "both",
      "each",
      "few",
      "many",
      "much",
      "neither",
      "either",
      "none",
    ]);

    return words
      ? words.filter((word) => {
          const notStopWord = !stopWordsSet.has(word.toLowerCase());
          const notCapitalized = word[0] !== word[0].toUpperCase();
          const isLongEnough = word.length > 3 && word.length <= 12;
          return notStopWord && notCapitalized && isLongEnough;
        })
      : [];
  };

  const countWordFrequencies = (words: string[]) => {
    const wordCounts: { [key: string]: number } = {};
    words.forEach((word) => {
      wordCounts[word.toUpperCase()] =
        (wordCounts[word.toUpperCase()] || 0) + 1;
    });
    return wordCounts;
  };

  const getTopWords = (
    wordCounts: { [key: string]: number },
    count: number
  ) => {
    const sortedWords = Object.entries(wordCounts).sort((a, b) => b[1] - a[1]);

    const topWords = sortedWords.slice(0, count);

    const lastFrequency = topWords[topWords.length - 1][1];
    const extraWords = sortedWords
      .slice(count)
      .filter((word) => word[1] === lastFrequency);
    if (extraWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * extraWords.length);
      topWords[topWords.length - 1] = extraWords[randomIndex];
    }

    return topWords.map((word) => word[0]);
  };

  const createGrid = (words: string[], gridSize: number) => {
    const grid = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill("")
    );

    const wordPositions: { word: string; positions: [number, number][] }[] = [];

    words.forEach((word) => {
      let placed = false;
      while (!placed) {
        const direction = Math.random() > 0.5 ? "horizontal" : "vertical";
        const startRow = Math.floor(
          Math.random() *
            (direction === "horizontal" ? gridSize : gridSize - word.length)
        );
        const startCol = Math.floor(
          Math.random() *
            (direction === "vertical" ? gridSize : gridSize - word.length)
        );

        let fits = true;
        const positions: [number, number][] = [];

        for (let i = 0; i < word.length; i++) {
          if (direction === "horizontal") {
            if (grid[startRow][startCol + i] !== "") {
              fits = false;
              break;
            }
            positions.push([startRow, startCol + i]);
          } else {
            if (grid[startRow + i][startCol] !== "") {
              fits = false;
              break;
            }
            positions.push([startRow + i, startCol]);
          }
        }

        if (fits) {
          positions.forEach(([row, col], idx) => {
            grid[row][col] = word[idx];
          });
          wordPositions.push({ word, positions });
          placed = true;
        }
      }
    });

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (grid[i][j] === "") {
          grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

    return { grid, wordPositions };
  };

  const handleExtractWords = () => {
    const words = extractWords(text);
    const wordCounts = countWordFrequencies(words);
    const topWords = getTopWords(wordCounts, 10);
    const { grid, wordPositions } = createGrid(topWords, 12);
    setGrid(grid);
    setPlacedWordPositions(wordPositions); // 배치된 단어와 그 위치 저장
    setPlacedWords(topWords); // 배치된 단어 목록 저장
  };

  const [grid, setGrid] = useState<string[][]>([]);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [placedWords, setPlacedWords] = useState<string[]>([]); // 배치된 단어 상태
  const [placedWordPositions, setPlacedWordPositions] = useState<
    { word: string; positions: [number, number][] }[]
  >([]); // 배치된 단어의 위치 상태

  return (
    <Container>
      <Title>Word Hunt</Title>
      <Button onClick={handleExtractWords}>Extract Words</Button>
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

      <GridContainer>
        <h2>12x12 Grid:</h2>
        <Grid>
          {grid.map((row, rowIndex) =>
            row.map((letter, colIndex) => {
              const isAnswer =
                showAnswer &&
                placedWordPositions.some(({ positions }) =>
                  positions.some(([r, c]) => r === rowIndex && c === colIndex)
                );
              return (
                <Cell key={`${rowIndex}-${colIndex}`} isAnswer={isAnswer}>
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

// Styled components

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
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
  grid-template-columns: repeat(12, 20px);
  grid-gap: 0.5rem;
`;

const Cell = styled.div<{ isAnswer: boolean }>`
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  font-weight: bold;
  background-color: ${(props) =>
    props.isAnswer ? props.theme.colors.primary : "white"};
  color: ${(props) => (props.isAnswer ? "white" : "black")};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 0.25rem;
  cursor: ${(props) => (props.isAnswer ? "pointer" : "default")};
`;

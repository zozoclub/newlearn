export const handleMouseDown = (
  row: number,
  col: number,
  setSelectedPositions: React.Dispatch<
    React.SetStateAction<[number, number][]>
  >,
  setIncorrectSelection: React.Dispatch<React.SetStateAction<boolean>>,
  isDisabled: boolean,
  correctSelections: [number, number][]
) => {
  if (isDisabled) return;

  // 이미 정답으로 선택된 칸은 드래그할 수 없음
  if (correctSelections.some(([r, c]) => r === row && c === col)) return;

  setSelectedPositions([[row, col]]);
  setIncorrectSelection(false);
};

export const handleMouseOver = (
  row: number,
  col: number,
  selectedPositions: [number, number][],
  setSelectedPositions: React.Dispatch<
    React.SetStateAction<[number, number][]>
  >,
  isDisabled: boolean,
  grid: string[][] // 추가된 grid 파라미터
) => {
  if (isDisabled || selectedPositions.length === 0) return;

  const [startRow, startCol] = selectedPositions[0];

  // 그리드 경계 밖으로 나가면 드래그 중지
  if (row < 0 || col < 0 || row >= grid.length || col >= grid[0].length) {
    setSelectedPositions([]); // 선택 상태 초기화
    return;
  }

  // 가로 또는 세로로만 드래그 가능
  const isSameRow = row === startRow;
  const isSameCol = col === startCol;

  if (!isSameRow && !isSameCol) return;
  if (row < 0 || col < 0 || row >= 12 || col >= 12) return;

  setSelectedPositions((prev) => [...prev, [row, col]]);
};

export const handleMouseUp = (
  grid: string[][],
  selectedPositions: [number, number][],
  placedWordPositions: { word: string; positions: [number, number][] }[],
  setCorrectSelections: React.Dispatch<React.SetStateAction<[number, number][]>>,
  setIncorrectSelection: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedPositions: React.Dispatch<React.SetStateAction<[number, number][]>>,
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>,
  updateCorrectWord: (word: string) => void,
  setCorrectWordsCount: React.Dispatch<React.SetStateAction<number>>
) => {
  if (selectedPositions.length === 0) return;

  // 선택된 셀 초기화 조건 추가
  const [lastRow, lastCol] = selectedPositions[selectedPositions.length - 1];
  if (grid[lastRow][lastCol] === "") {
    setSelectedPositions([]); // 선택 상태 초기화
    return;
  }

  // 선택된 단어와 뒤집힌 단어 생성
  const selectedWord = selectedPositions
    .map(([row, col]) => grid[row][col])
    .join("")
    .toUpperCase();

  const reversedSelectedWord = selectedWord.split("").reverse().join("");

  const isCorrect = placedWordPositions.some(({ word, positions }) => {
    const isMatchingWord =
      (word === selectedWord || word === reversedSelectedWord) &&
      positions.length === selectedPositions.length;

    const isMatchingPositions =
      (word === selectedWord &&
        positions.every(
          ([row, col], idx) =>
            row === selectedPositions[idx][0] &&
            col === selectedPositions[idx][1]
        )) ||
      (word === reversedSelectedWord &&
        positions.every(
          ([row, col], idx) =>
            row === selectedPositions[selectedPositions.length - 1 - idx][0] &&
            col === selectedPositions[selectedPositions.length - 1 - idx][1]
        ));

    return isMatchingWord && isMatchingPositions;
  });

  // 정답 처리 로직
  if (isCorrect) {
    setCorrectSelections((prev) => [...prev, ...selectedPositions]);
    updateCorrectWord(selectedWord);
    setCorrectWordsCount((prev) => prev + 1);
    setSelectedPositions([]);
  } else {
    setIncorrectSelection(true);
    setIsDisabled(true);
    setTimeout(() => {
      setIncorrectSelection(false);
      setSelectedPositions([]);
      setIsDisabled(false);
    }, 1000);
  }
};

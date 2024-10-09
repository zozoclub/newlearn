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
  setCorrectSelections: React.Dispatch<
    React.SetStateAction<[number, number][]>
  >,
  setIncorrectSelection: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedPositions: React.Dispatch<
    React.SetStateAction<[number, number][]>
  >,
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>,
  updateCorrectWord: (word: string) => void,
  setCorrectWordsCount: React.Dispatch<React.SetStateAction<number>>
) => {
  if (selectedPositions.length === 0) return;

  // 빈칸에서 마우스를 뗐을 때 선택된 셀 초기화
  const [lastRow, lastCol] = selectedPositions[selectedPositions.length - 1];
  if (grid[lastRow][lastCol] === "") {
    setSelectedPositions([]); // 선택 상태 초기화
    return;
  }

  const selectedWord = selectedPositions
    .map(([row, col]) => grid[row][col])
    .join("")
    .toUpperCase();

  const isCorrect = placedWordPositions.some(({ word, positions }) => {
    return (
      word === selectedWord &&
      positions.length === selectedPositions.length &&
      positions.every(
        ([row, col], idx) =>
          row === selectedPositions[idx][0] && col === selectedPositions[idx][1]
      )
    );
  });
  // 정답일 경우
  if (isCorrect) {
    setCorrectSelections((prev) => [...prev, ...selectedPositions]); // 정답이면 파란색 유지
    updateCorrectWord(selectedWord); // 정답 단어 업데이트
    setCorrectWordsCount((prev) => (prev += 1));
    setSelectedPositions([]); // 선택된 셀 초기화
  } else {
    setIncorrectSelection(true); // 틀리면 빨간색으로 표시
    setIsDisabled(true); // 드래그 비활성화
    setTimeout(() => {
      setIncorrectSelection(false); // 1초 후 다시 복구
      setSelectedPositions([]); // 선택된 셀 초기화
      setIsDisabled(false); // 드래그 다시 활성화
    }, 1000);
  }
};

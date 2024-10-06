export const createGrid = (words: string[], gridSize: number) => {
    const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));
    const wordPositions: { word: string; positions: [number, number][] }[] = [];
    const placedWords: string[] = []; // 배치에 성공한 단어들만 저장

    words.forEach((word) => {
        let placed = false;
        let attempts = 0;
        const maxAttempts = 100; // 배치 시도 횟수 제한

        while (!placed && attempts < maxAttempts) {
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
                placedWords.push(word); // 성공적으로 배치된 단어만 저장
                placed = true;
            }
            attempts++;
        }

        if (!placed) {
            console.error(`단어를 배치하지 못했습니다: ${word}`);
        }
    });

    // 빈 칸만 필터링하여 무작위 알파벳으로 채우기
    const emptyPositions: [number, number][] = [];
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] === "") {
                emptyPositions.push([i, j]);
            }
        }
    }

    emptyPositions.forEach(([row, col]) => {
        grid[row][col] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    });

    return { grid, wordPositions, placedWords }; // placedWords 반환
};

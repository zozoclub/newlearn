export const createGrid = (words: string[], gridSize: number) => {
    const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));
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

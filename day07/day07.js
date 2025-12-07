import { readFileSync } from "fs"

try {
    const data = readFileSync("input07.txt", "utf8")
    const lines = data.split('\n')
    let map = []
    for (const line of lines) {
        map.push(line.trim().split(''))
    }
    const result = simulate(map)
    const splits = analyze_splits(result)
    const paths = analyze_paths(result)
    console.log(splits)
    console.log(paths)

} catch (error) {
    console.error("Error reading the file:", error)
}

function simulate(map) {
    let result = map.slice()
    const startPosition = map[0].findIndex(e => e === "S")
    result[1][startPosition] = "|"
    let positions = new Set()
    positions.add(startPosition)
    let terminatedPositions = new Set()
    let addedPositions = new Set()
    for (let i = 2; i < result.length; i++) {
        for (const position of positions) {
            if (result[i][position] === "^") {
                terminatedPositions.add(position)
                addedPositions.add(position - 1)
                addedPositions.add(position + 1)
                result[i][position - 1] = "|"
                result[i][position + 1] = "|"
            } else {
                result[i][position] = "|"
            }
        }
        if (addedPositions.size > 0) {
            positions = positions.union(addedPositions)
            addedPositions.clear()
        }
        if (terminatedPositions.size > 0) {
            positions = positions.difference(terminatedPositions)
            terminatedPositions.clear()
        }
        
    }
    return result
}

function analyze_splits(result) {
    let splits = 0
    for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < result[i].length; j++) {
            if (result[i][j] === "^") {
                if (result[i-1][j] === "|") {
                    splits++
                }
            }
        }
    }
    return splits                
}

function analyze_paths(result) {
    const startPosition = result[0].findIndex(e => e === 'S');
    if (startPosition === -1) {
        return 0;
    }

    const rows = result.length;
    const cols = result[0].length;

    let currentRowCounts = Array(cols).fill(0);
    // Paths start conceptually on row 0 at the S position.
    currentRowCounts[startPosition] = 1;

    // Iterate from row 0 to the second-to-last row
    for (let r = 0; r < rows - 1; r++) {
        const nextRowCounts = Array(cols).fill(0);
        for (let c = 0; c < cols; c++) {
            if (currentRowCounts[c] > 0) {
                const count = currentRowCounts[c];
                const char_below = result[r + 1][c];

                if (char_below === '^') {
                    // Path splits, propagate to the left and right branches in the next row.
                    if (c > 0 && result[r + 1][c - 1] === '|') {
                        nextRowCounts[c - 1] += count;
                    }
                    if (c < cols - 1 && result[r + 1][c + 1] === '|') {
                        nextRowCounts[c + 1] += count;
                    }
                } else if (char_below === '|') {
                    // Path goes straight down.
                    nextRowCounts[c] += count;
                }
            }
        }
        currentRowCounts = nextRowCounts;
    }

    // The total is the sum of all paths that reached the final row.
    return currentRowCounts.reduce((sum, count) => sum + count, 0);
}
import { readFileSync } from "fs"

try {
    const data = readFileSync("day07/examples.txt", "utf8")
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
    const startPosition = result[0].findIndex(e => e === "S")
    return analyze_below(result.slice(1), startPosition )
}

function analyze_below(result, position) {
    if (result.length <= 1) {
        return 1
    }

    // Check the character in the next row at the current position to decide where to go.
    const char_below = result[1][position];

    if (char_below === '^') {
        // Path splits. Follow the left and right branches.
        let sum = 0;
        sum += analyze_below(result.slice(1), position - 1);
        sum += analyze_below(result.slice(1), position + 1);
        return sum;
    } else if (char_below === '|') {
        // Path goes straight down.
        return analyze_below(result.slice(1), position);
    }

    // Path terminates.
    return 0;
}
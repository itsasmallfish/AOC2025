//@ts-ignore
import { readFileSync } from "fs"

try {
    const data = readFileSync("day06/input06.txt", "utf8")
    const lines = data.split("\n").filter((line: string) => line.trim() !== '')
    const cleanedLines = lines.map((line: string) => line.trim().split(/\s+/));
    const operations = cleanedLines.at(-1)

    //now transpose
    const operandTable = []
    const tableWidth = operations.length
    for (let i = 0; i < tableWidth; i++) {
        let column = []
        for (let j = 0; j < cleanedLines.length - 1; j++) {
            column.push(cleanedLines[j][i])
        }
        operandTable.push(column)
    }
    let solutions = []
    for (let i = 0; i < tableWidth; i++) {
        let solution
        if (operations[i] == "+") {
            solution = operandTable[i].reduce((sum, curr) => sum + parseInt(curr), 0)
        }
        else if (operations[i] == "*") {
            solution = operandTable[i].reduce((product, curr) => product * parseInt(curr), 1)
        }
        solutions.push(solution)
    }
    console.log(solutions)
    console.log(solutions.reduce((sum, curr) => sum + curr, 0))

} catch (error) {
    console.error("Error reading the file:", error)
}

import { readFileSync } from "fs"

interface ParsedInput {
    operandTable: string[][];
    operations: string[];
}

function getDigitAtIndex(text: string, index: number): number | undefined {
    if (index < 0 || index >= text.length) {
        return undefined;
    }
    const digit = parseInt(text[index], 10);
    return isNaN(digit) ? undefined : digit;
}

function parseInput(data: string): ParsedInput {
    const lines = data.split("\n").filter((line) => line.trim() !== '');
    if (lines.length < 2) {
        throw new Error("Input data must have at least two lines.");
    }

    const maxLength = Math.max(...lines.map(l => l.length));
    const paddedLines = lines.map(l => l.padEnd(maxLength, ' '));

    // Pop the operator line from the end, leaving the number lines.
    const operatorLine = paddedLines.pop()!;
    const numberLines = paddedLines;

    const operatorMatches = [...operatorLine.matchAll(/([^\s])/g)];
    const operations = operatorMatches.map(match => match[0]);
    const columnStarts = operatorMatches.map(match => match.index as number);

    const operandTable = columnStarts.map((start, i) => {
        const end = columnStarts[i + 1] ?? maxLength;
        return numberLines.map(line => line.substring(start, end));
    });

    return { operandTable, operations };
}

function calculateSolutions(operandTable: string[][], operations: string[]): number[] {
    const solutions = [];
    for (let i = 0; i < operandTable.length; i++) {
        const column = operandTable[i];
        const operation = operations[i];
        const columnWidth = column.length > 0 ? Math.max(...column.map(c => c.length)) : 0;
        
        const verticalNumbers: number[] = [];
        for (let j = 0; j < columnWidth; j++) {
            const numberSlice = column
                .map(row => getDigitAtIndex(row, j))
                .filter((d): d is number => d !== undefined);
            
            if (numberSlice.length > 0) {
                verticalNumbers.push(parseInt(numberSlice.join(""), 10));
            }
        }

        let solution;
        if (operation === "+") {
            solution = verticalNumbers.reduce((sum, curr) => sum + curr, 0);
        } else if (operation === "*") {
            solution = verticalNumbers.reduce((prod, curr) => prod * curr, 1);
        } else {
            solution = 0; // Default or throw error
        }
        solutions.push(solution);
    }
    return solutions;
}

function main() {
    try {
        const data = readFileSync("input06.txt", "utf8");
        const { operandTable, operations } = parseInput(data);
        const solutions = calculateSolutions(operandTable, operations);
        const finalResult = solutions.reduce((sum, curr) => sum + curr, 0);
        console.log(finalResult);
    } catch (error) {
        console.error("Error processing file:", error instanceof Error ? error.message : error);
    }
}

main();

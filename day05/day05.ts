import { readFileSync } from "fs"

try {
    const data = readFileSync("input05.txt", "utf8")
    const parts = data.split(/\r?\n\r?\n/);
    const ranges = parts[0].split("\n").map((range: string) => range.split("-").map(Number))
    const ids = parts[1].split("\n")
    const validIdCount = ids.filter((id: string) => isValidId(ranges, parseInt(id, 10))).length
    
    console.log(countValid(ranges))
    console.log(validIdCount);
} catch (error) {
    console.error("Error reading the file:", error)
}


function isValidId(ranges: number[][], id: number): boolean {
    return ranges.some(([start, end]) => id >= start && id <= end);
}

function countValid(ranges: number[][]): number {
    const mergedRanges = mergeOverlappingRanges(ranges);
    return mergedRanges.reduce((sum, [start, end]) => sum + (end - start + 1), 0);
}

function mergeOverlappingRanges(ranges: number[][]): number[][] {
    if (ranges.length === 0) {
        return [];
    }

    // 1. Sort ranges by their starting point
    const sortedRanges = [...ranges].sort((a, b) => a[0] - b[0]);

    const merged: number[][] = [];
    let currentRange = sortedRanges[0];

    // 2. Iterate and merge
    for (let i = 1; i < sortedRanges.length; i++) {
        const nextRange = sortedRanges[i];
        const [currentStart, currentEnd] = currentRange;
        const [nextStart, nextEnd] = nextRange;

        if (nextStart <= currentEnd + 1) { // Overlap or adjacent
            // Merge by extending the current range
            currentRange = [currentStart, Math.max(currentEnd, nextEnd)];
        } else {
            // No overlap, push the current range and start a new one
            merged.push(currentRange);
            currentRange = nextRange;
        }
    }

    // 3. Add the last processed range
    merged.push(currentRange);

    return merged;
}

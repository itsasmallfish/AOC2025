import { readFileSync } from 'fs';

function find_innvalid_in_range(range) {
    const [minStr, maxStr] = range.split("-");
    const min = parseInt(minStr, 10);
    const max = parseInt(maxStr, 10);
    let length_candidates = []
    let multiply_candidates = []
    for (let i = 1; i <= maxStr.length/2; i++) {
        length_candidates.push(i)
    }
    for (let i = 2; i <= maxStr.length; i++) {
        multiply_candidates.push(i)
    }
    let candidates = []
    for (const l of length_candidates) {
        for (const m of multiply_candidates) {
            if (m*l <= maxStr.length && m*l >= minStr.length) {
                candidates.push(...create_candidates(l,m))
            }
        }
    }
    // Use a Set to handle duplicates and then filter
    const uniqueCandidates = [...new Set(candidates)];
    return uniqueCandidates.filter(candidate => candidate >= min && candidate <= max) // filter candidates that are in range 
}

/*
 * Creates all sequences of digits repeated m-times of given length 
 */
function create_candidates(length, m) {
    let candidates = []
    let start = 1 // smalest length length digit e.g. for length 4 => 1000
    let end = 10 // smalest length + 1 length digit e.g. for length 4 => 10000
    for (let i = 1; i < length; i++) {
        start *= 10
        end *= 10
    }
    for (let i = start; i < end; i++) {
        const base = i.toString();
        candidates.push(parseInt(base.repeat(m), 10));
    }
    return candidates
}

let sum = 0
try {
    const data = readFileSync("input02.txt", "utf8")
    const ranges = data.split(",")
    for (const range of ranges) {
        sum += find_innvalid_in_range(range).reduce((a,b) => a+b, 0)
    }
} catch (error) {
    console.error("Error reading the file:", error)
}

console.log(sum)

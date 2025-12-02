import { readFileSync } from 'fs';

function find_innvalid_in_range(range) {
    let min = range.split("-")[0]
    let max = range.split("-")[1]
    let length_canidates = []
    let multiply_canidates = []
    for (let i = 1; i <= max.length/2; i++) {
        length_canidates.push(i)
    }
    for (let i = 2; i <= max.length; i++) {
        multiply_canidates.push(i)
    }
    let candidates = []
    for (const l of length_canidates) {
        for (const m of multiply_canidates) {
            if (m*l <= max.length && m*l >= min.length) {
                candidates.push(...create_candidates(l,m))
                console.log(candidates)
            }
        }
    }
    return candidates.filter(candidate => candidate >= min && candidate <= max) // filter canidates that are in range 
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
    console.log(length, m)
    console.log(start, end)
    for (let i = start; i < end; i++) {
        let candidate = i.toString()
        for (let j = 1; j < m; j++) {
            candidate = candidate.concat(candidate)
        }
        candidates.push(parseInt(candidate))
    }
    return candidates
}

let sum = 0
try {
    const data = readFileSync("examples.txt", "utf8")
    const ranges = data.split(",")
    for (const range of ranges) {
        sum += find_innvalid_in_range(range).reduce((a,b) => a+b, 0)
    }
} catch (error) {
    console.error("Error reading the file:", error)
}

console.log(sum)

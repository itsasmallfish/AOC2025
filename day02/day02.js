import { readFileSync } from 'fs';

function find_innvalid_in_range(range) {
    let min = range.split("-")[0]
    let max = range.split("-")[1]
    let length_canidates = []
    for (let i = min.length; i <= max.length; i++) {
        if(i % 2 == 0) {
            length_canidates.push(i)
        }
    }
    let candidates = []
    for (const l of length_canidates) {
        candidates.push(...create_candidates(l))
    }
    return candidates.filter(candidate => candidate >= min && candidate <= max) // filter canidates that are in range 
}

/*
 * Creates all sequences of digits repeated twice of given length 
 */
function create_candidates(length) {
    let candidates = []
    let start = 1 // smalest length/2 digit e.g. for length 4 => 10
    let end = 10 // smalest length/2 + 1 digit e.g. for length 4 => 100
    for (let i = 1; i < length/2; i++) {
        start *= 10
        end *= 10
    }
    for (let i = start; i < end; i++) {
        var candidate = i.toString()
        candidates.push(parseInt(candidate.concat(candidate)))
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

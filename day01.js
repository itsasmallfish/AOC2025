const fs = require('fs');

const Method = {
    POINT_COUNTER,
    PASSING_COUNTER
}

const DIAL_SIZE = 100
const PASSOWORD_METHOD = POINT_COUNTER

let pointer = 50
let password_counter = 0

function shift(instruction) {
    const direction = instruction[0]
    const amount = parseInt(instruction.slice(1), 10)
    switch (direction) {
        case "R":
            pointer += amount
            break
        case "L":
            pointer -= amount
            break
    }
    pointer = pointer % DIAL_SIZE
    if (pointer == 0) {
        password_counter++
    }
}

try {
    const data = fs.readFileSync("day01_input01.txt", "utf8");
    const instructions = data.split("\n");
    for (const instruction of instructions) {
        // Ensure we don't process empty lines
        if (instruction) {
            shift(instruction);
        }
    }
} catch (error) {
    console.error("Error reading the file:", error);
}

console.log(password_counter)

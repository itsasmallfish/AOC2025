import { readFileSync } from 'fs';

function calculate_joltage(bank: string): number {
    let batteries = Array.from(bank, Number)
    let [max_value, max_index] = calculate_max_with_index(batteries, 0, -1)
    let seccond_value = Math.max(...batteries.slice(max_index+1))
    return parseInt("" + max_value + seccond_value)
}

function calculate_joltage_safty_overide(bank: string): number {
    let batteries = Array.from(bank, Number)
    let joltages = []
    let last_battery_index = 0
    for (let remaining = -11; remaining < 0; remaining++) {
        let [max_value, max_index] = calculate_max_with_index(batteries, last_battery_index, remaining)
        last_battery_index = max_index + 1
        joltages.push(max_value.toString())
    }
    joltages.push(Math.max(...batteries.slice(last_battery_index)))

    return parseInt(joltages.join(""))
}

function calculate_max_with_index(numbers: number[], start: number, end: number): number[] {
    let max_value = numbers[start]
    let max_index = start
    for (let i = start + 1; i < numbers.length + end; i++) {
        if (numbers[i] > max_value) {
            max_value = numbers[i]
            max_index = i
        }
    }
    return [max_value, max_index]
}

let sum = 0
try {
    const data = readFileSync("input03.txt", "utf8")
    const banks = data.split("\n")
    for (const bank of banks) {
        if (bank === "") {
            continue
        }
        sum += calculate_joltage_safty_overide(bank)
    }
} catch (error) {
    console.error("Error reading the file:", error)
}

console.log(sum)



import { readFileSync } from "fs"

let sum = 0
try {
    const data = readFileSync("input04.txt", "utf8")
    const initialMap = create_map(data)
    let paddedMap = add_padding(initialMap)
    let markedMap = mark_map(paddedMap) 
    let last_sum = -1
    while (last_sum != sum) {
        last_sum = sum
        sum += markedMap.flat().reduce((acc, val) => acc + val, 0);
        remove_marked(paddedMap, markedMap)
        markedMap = mark_map(paddedMap)
    }
    console.log(sum)
} catch (error) {
    console.error("Error reading the file:", error)
}


function mark_map(map: number[][]): number[][] {
    if (map.length === 0) return [];

    // Create a new array with the same dimensions, filled with zeros.
    const markedMap = Array.from({ length: map.length }, () => 
        new Array(map[0].length).fill(0)
    );

    const neighborDeltas = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],          [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    for(let i = 1; i < map.length - 1; i++) {
        for(let j = 1; j < map[i].length - 1; j++) {
            if (map[i][j] === 0) continue
            
            const neighborSum = neighborDeltas.reduce((sum, [dr, dc]) => {
                return sum + map[i + dr][j + dc];
            }, 0);
            if (neighborSum < 4) {
                markedMap[i][j] = 1
            }
        }
    }
    return markedMap
}

/**
 * Parses a string representation of a grid into a 2D number array.
 * Where '@' is 1 and '.' is 0
 */
function create_map(data: string): number[][] {
    return data.trim().split('\n').map(line => 
        line.split('').map(char => {
            if (char === '@') {
                return 1
            } else {
                return 0
            }
        })
    );
}

/**
 * Adds a padding of 0s to all sides of a 2D array.
 * @param map The input 2D number array.
 * @returns A new 2D array with padding.
 */
function add_padding(map: number[][]): number[][] {
    if (map.length === 0) return [];

    const paddedCols = map[0].length + 2;
    const zeroRow = new Array(paddedCols).fill(0);

    const paddedMap = map.map(row => [0, ...row, 0]);

    return [zeroRow, ...paddedMap, zeroRow];
}

/**
 * Uses a mask to remove elements from a map by mutating it.
 * Elements in the map corresponding to a 1 in the mask are set to 0.
 * @param map The input 2D number array to mutate.
 * @param mask The mask 2D number array.
 */
function remove_marked(map: number[][], mask: number[][]): void {
    for (let i = 0; i < mask.length; i++) {
        for (let j = 0; j < mask[i].length; j++) {
            if (mask[i][j] === 1) {
                map[i][j] = 0;
            }
        }
    }
}

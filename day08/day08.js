const fs = require('fs');
const path = require('path');

function parsePoints(data) {
    return data.trim().split('\n').map((line, index) => {
        const [x, y, z] = line.split(',').map(Number);
        return { id: index, x, y, z };
    });
}

function calculateDistance(p1, p2) {
    return Math.sqrt(
        Math.pow(p1.x - p2.x, 2) +
        Math.pow(p1.y - p2.y, 2) +
        Math.pow(p1.z - p2.z, 2)
    );
}

class DSU {
    constructor(n) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.numSets = n;
    }

    find(i) {
        if (this.parent[i] === i) {
            return i;
        }
        return this.parent[i] = this.find(this.parent[i]);
    }

    union(i, j) {
        const rootI = this.find(i);
        const rootJ = this.find(j);
        if (rootI !== rootJ) {
            this.parent[rootJ] = rootI;
            this.numSets--;
            return true;
        }
        return false;
    }
}

function findLastConnection(points) {
    const distances = [];
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const dist = calculateDistance(points[i], points[j]);
            distances.push({ p1: points[i], p2: points[j], dist });
        }
    }

    distances.sort((a, b) => a.dist - b.dist);

    const dsu = new DSU(points.length);
    let lastEdge = null;

    for (const edge of distances) {
        if (dsu.union(edge.p1.id, edge.p2.id)) {
            if (dsu.numSets === 1) {
                lastEdge = edge;
                break;
            }
        }
    }
    return lastEdge;
}

function main() {
    const filePath = path.join(__dirname, 'input08.txt');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading the file:", err);
            return;
        }

        const points = parsePoints(data);
        const lastConnection = findLastConnection(points);

        if (lastConnection) {
            const result = lastConnection.p1.x * lastConnection.p2.x;
            console.log(`The product of the X coordinates of the last two points you need to connect is: ${result}`);
        } else {
            console.log("Could not determine the last two points to connect.");
        }
    });
}

main();

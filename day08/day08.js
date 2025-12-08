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

function findClusters(points) {
    const distances = [];
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const dist = calculateDistance(points[i], points[j]);
            distances.push({ p1: points[i], p2: points[j], dist });
        }
    }

    distances.sort((a, b) => a.dist - b.dist);

    const nearestEdges = distances.slice(0, 1000);

    const adj = new Map();
    points.forEach(p => adj.set(p.id, []));

    for (const edge of nearestEdges) {
        adj.get(edge.p1.id).push(edge.p2.id);
        adj.get(edge.p2.id).push(edge.p1.id);
    }

    const clusters = [];
    const visited = new Set();

    for (const point of points) {
        if (!visited.has(point.id)) {
            const cluster = [];
            const queue = [point.id];
            visited.add(point.id);

            while (queue.length > 0) {
                const currentId = queue.shift();
                const currentPoint = points.find(p => p.id === currentId);
                cluster.push(currentPoint);

                const neighbors = adj.get(currentId) || [];
                for (const neighborId of neighbors) {
                    if (!visited.has(neighborId)) {
                        visited.add(neighborId);
                        queue.push(neighborId);
                    }
                }
            }
            clusters.push(cluster);
        }
    }

    return clusters;
}

function main() {
    const filePath = path.join(__dirname, 'input08.txt');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading the file:", err);
            return;
        }

        const points = parsePoints(data);
        const clusters = findClusters(points);

        clusters.sort((a, b) => b.length - a.length);

        const top3Clusters = clusters.slice(0, 3);

        console.log("Top 3 clusters by member count:");
        top3Clusters.forEach((cluster, i) => {
            console.log(`Cluster ${i + 1}: ${cluster.length} members`);
        });
    });
}

main();
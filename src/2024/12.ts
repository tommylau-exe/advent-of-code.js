#!/usr/bin/env -S deno run

import fs from "node:fs";

const input = fs.readFileSync(0, { encoding: "utf8" });
const map = input.split("\n").slice(0, -1);

function* neighbors(x: number, y: number) {
    const offsets = [[-1, 0], [0, -1], [1, 0], [0, 1]];
    for (const [dx, dy] of offsets) {
        const nx = x + dx, ny = y + dy;
        if (map[ny] && map[ny][nx] == map[y][x]) {
            yield [nx, ny];
        }
    }
}

const areaVisited = new Set<string>();
function area(x: number, y: number): number {
    const key = `${x},${y}`;
    if (areaVisited.has(key)) {
        return 0;
    } else {
        areaVisited.add(key);
    }

    let a = 1;
    for (const [nx, ny] of neighbors(x, y)) {
        a += area(nx, ny);
    }

    return a;
}

const perimeterVisited = new Set<string>();
function perimeter(x: number, y: number): number {
    const key = `${x},${y}`;
    if (perimeterVisited.has(key)) {
        return 0;
    } else {
        perimeterVisited.add(key);
    }

    let p = 4;
    for (const [nx, ny] of neighbors(x, y)) {
        p += perimeter(nx, ny) - 1;
    }

    return p;
}

let price = 0;
for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
        price += area(x, y) * perimeter(x, y);
    }
}

console.log(price);

#!/usr/bin/env -S deno run

import fs from "node:fs";

const input = fs.readFileSync(0, { encoding: "utf8" });
const map = input.split("\n").slice(0, -1).map((row) =>
    row.split("").map(Number)
);

function* neighbors(x: number, y: number) {
    const offsets = [[-1, 0], [0, -1], [1, 0], [0, 1]];
    for (const [dx, dy] of offsets) {
        const [nx, ny] = [x + dx, y + dy];
        if (map[ny] && map[ny][nx]) {
            yield { elevation: map[ny][nx], x: nx, y: ny };
        }
    }
}

const trailheads = new Array<[number, number]>();
for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] == 0) {
            trailheads.push([x, y]);
        }
    }
}

class TrailPointSet {
    #points: Set<number>;

    constructor() {
        this.#points = new Set<number>();
    }

    add(x: number, y: number): boolean {
        return this.#points.size !=
            this.#points.add(y * map[x].length + x).size;
    }
}

let scores = 0;
for (const [x, y] of trailheads) {
    const position = new Array<[number, number]>([x, y]);
    const endpoints = new TrailPointSet();
    while (position.length > 0) {
        const [x, y] = position.pop()!;
        const e = map[y][x];

        if (e == 9) {
            if (endpoints.add(x, y)) {
                // don't add duplicate endpoints to score
                scores++;
            }

            continue;
        }

        for (const { elevation: ne, x: nx, y: ny } of neighbors(x, y)) {
            if (ne != e + 1) {
                continue; // elevation must increase by exactly 1
            }

            position.push([nx, ny]);
        }
    }
}

console.log(scores);

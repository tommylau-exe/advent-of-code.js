#!/usr/bin/env -S deno run

import fs from "node:fs";

const input = fs.readFileSync(0, { encoding: "utf8" });
const map = input.split("\n").slice(0, -1);

let sx = 0, sy = 0;
findStart: for (; sy < map.length; sy++) {
    for (sx = 0; sx < map[sy].length; sx++) {
        if (map[sy][sx] == "^") {
            break findStart;
        }
    }
}

function obstacle(x: number, y: number): boolean {
    return map[y] !== undefined && map[y][x] == "#";
}

// turn 90deg to the right (trust me it works)
function turn(dx: number, dy: number): [number, number] {
    return [dy * -1, dx];
}

let positions = 0;
for (let oy = 0; oy < map.length; oy++) {
    for (let ox = 0; ox < map[oy].length; ox++) {
        let x = sx, y = sy;
        let dx = 0, dy = -1;

        // for each position, the last direction we were travelling
        // NOTE: JS doesn't support value equality, so although I'd like to
        // represent this as a Map, we'll have to settle for representing 2D
        // points as 1D row-major indices
        const directions = new Array<[number, number] | undefined>(
            map.length * map[0].length,
        );

        // simulate guard's path
        while (map[y] && map[y][x]) {
            // may need to turn multiple times
            while (obstacle(x + dx, y + dy) || x + dx == ox && y + dy == oy) {
                [dx, dy] = turn(dx, dy);
            }

            const dirIndex = map[y].length * y + x;
            const prevDir = directions[dirIndex];
            if (prevDir && prevDir[0] == dx && prevDir[1] == dy) {
                // cycle detected, walking in same direction on same spot
                positions++;
                break;
            }

            directions[dirIndex] = [dx, dy];
            x += dx;
            y += dy;
        }
    }
}

console.log(positions);

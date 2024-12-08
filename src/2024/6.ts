#!/usr/bin/env -S deno run

// parse stdin as utf-8 text
const decoder = new TextDecoder();
const buffer = new Uint8Array(2 ** 16); // 64KiB
let input = "";
while (Deno.stdin.readSync(buffer)) {
    input += decoder.decode(buffer);
}

const map = input.split("\n").slice(0, -1);

let x = 0, y = 0;
findStart: for (; y < map.length; y++) {
    for (x = 0; x < map[y].length; x++) {
        if (map[y][x] == "^") {
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

let dx = 0, dy = -1;
const visited = new Set<number>(); // set of 1D indices into map in row-major order
while (map[y] && map[y][x]) {
    visited.add(map[y].length * y + x);

    if (obstacle(x + dx, y + dy)) {
        [dx, dy] = turn(dx, dy);
    }

    x += dx;
    y += dy;
}

console.log(visited.size);

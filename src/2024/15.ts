#!/usr/bin/env -S deno run

import fs from "node:fs";

const input = fs.readFileSync(0, { encoding: "utf8" });

function expand(c: string): string {
    switch (c) {
        case "O":
            return "[]";
        case "@":
            return "@.";
        default:
            return c + c;
    }
}

const [mapInput, cmdInput] = input.split("\n\n");
const map = mapInput.split("\n")
    .map((l) => l.split("").map(expand).join("").split(""));
const cmd = cmdInput.replaceAll(/\s+/g, "");

const dirToOffset = {
    "<": [-1, 0],
    ">": [1, 0],
    "^": [0, -1],
    "v": [0, 1],
};
type Direction = "<" | ">" | "^" | "v";
function canMove(x: number, y: number, dir: Direction): boolean {
    if (map[y][x] == ".") {
        return true;
    }

    if (map[y][x] == "#") {
        return false;
    }

    const [dx, dy] = dirToOffset[dir];
    if (map[y][x] == "@" || dir == "<" || dir == ">") {
        return canMove(x + dx, y + dy, dir);
    }

    if (map[y][x] == "[") {
        return canMove(x + dx, y + dy, dir) && canMove(x + dx + 1, y + dy, dir);
    }

    return canMove(x + dx, y + dy, dir) && canMove(x + dx - 1, y + dy, dir);
}

function move(x: number, y: number, dir: Direction): [number, number] {
    if (!canMove(x, y, dir)) {
        return [x, y];
    }

    // inner recursive function
    const [dx, dy] = dirToOffset[dir];
    function _move(x: number, y: number) {
        if (map[y][x] == ".") {
            return;
        }

        // move tiles in front
        _move(x + dx, y + dy);

        if (dir == "^" || dir == "v") {
            // move other half
            if (map[y][x] == "[") {
                _move(x + 1, y + dy);
                map[y + dy][x + 1] = map[y][x + 1];
                map[y][x + 1] = ".";
            }
            if (map[y][x] == "]") {
                _move(x - 1, y + dy);
                map[y + dy][x - 1] = map[y][x - 1];
                map[y][x - 1] = ".";
            }
        }

        // move this tile
        map[y + dy][x + dx] = map[y][x];
        map[y][x] = ".";
    }
    _move(x, y);

    return [x + dx, y + dy];
}

// find robot
let rx = 0, ry = 0;
while (map[ry][rx] != "@") {
    rx = (rx + 1) % map[0].length;
    ry += rx == 0 ? 1 : 0;
}

// simulate
for (let i = 0; i < cmd.length; i++) {
    [rx, ry] = move(rx, ry, cmd[i] as Direction);
}

let sum = 0;
for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] == "[") {
            sum += x + y * 100;
        }
    }
}

console.log(sum);

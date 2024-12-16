#!/usr/bin/env -S deno run

import fs from "node:fs";

const input = fs.readFileSync(0, { encoding: "utf8" });

let width = 0, height = 0;
const robots = [];
for (const robot of input.split("\n").slice(0, -1)) {
    const [x, y, vx, vy] = robot.matchAll(/-?\d+/g).map(Number);
    robots.push({ x, y, vx, vy });

    // derive map size
    width = Math.max(width, x + 1);
    height = Math.max(height, y + 1);
}

// always return positive values
function mod(x: number, y: number): number {
    return ((x % y) + y) % y;
}

for (let i = 0; i < 100; i++) {
    for (const robot of robots) {
        robot.x = mod(robot.x + robot.vx, width);
        robot.y = mod(robot.y + robot.vy, height);
    }
}

const quads = [0, 0, 0, 0];
for (const robot of robots) {
    if (robot.x < width / 2 - 1 && robot.y < height / 2 - 1) {
        quads[0]++;
    }
    if (robot.x > width / 2 && robot.y < height / 2 - 1) {
        quads[1]++;
    }
    if (robot.x < width / 2 - 1 && robot.y > height / 2) {
        quads[2]++;
    }
    if (robot.x > width / 2 && robot.y > height / 2) {
        quads[3]++;
    }
}

console.log(quads.reduce((prod, n) => prod * n));

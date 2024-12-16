#!/usr/bin/env -S deno run

import fs from "node:fs";
import process from "node:process";

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

const map = new Array<boolean>(width * height);
for (let iter = 1; iter < 10_000; iter++) {
    // simulation
    map.fill(false);
    for (const robot of robots) {
        robot.x = mod(robot.x + robot.vx, width);
        robot.y = mod(robot.y + robot.vy, height);

        map[robot.y * width + robot.x] = true;
    }

    // just check for a bunch of X I suppose
    if (!map.map((r) => r && "X" || ".").join("").includes("XXXXXXXXX")) {
        continue;
    }

    // draw to console
    process.stdout.write(`${iter}\n`);
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            process.stdout.write(map[y * width + x] && "X" || ".");
        }
        process.stdout.write("\n");
    }

    break;
}

#!/usr/bin/env -S deno run

import fs from "node:fs";

const input = fs.readFileSync(0, { encoding: "utf8" });

const left = new Array<number>();
const right = new Map<number, number>();
for (const line of input.split("\n").slice(0, -1)) {
    const [leftNum, rightNum] = line.split(/\s+/).map((n) => parseInt(n));
    left.push(leftNum);
    right.set(rightNum, (right.get(rightNum) ?? 0) + 1);
}

let similarityScore = 0;
for (const n of left) {
    similarityScore += n * (right.get(n) ?? 0);
}

console.log(similarityScore);

#!/usr/bin/env -S deno run

// parse stdin as utf-8 text
const decoder = new TextDecoder();
const buffer = new Uint8Array(2 ** 16); // 64KiB
let input = "";
while (Deno.stdin.readSync(buffer)) {
    input += decoder.decode(buffer);
}

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

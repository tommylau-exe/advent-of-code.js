#!/usr/bin/env -S deno run

import fs from "node:fs";

const input = fs.readFileSync(0, { encoding: "utf8" });

let tokens = 0;
for (const machine of input.split("\n\n")) {
    let [ax, ay, bx, by, px, py] = machine.matchAll(/\d+/g)
        .map((m) => parseInt(m[0]));

    px += 10_000_000_000_000;
    py += 10_000_000_000_000;

    console.log(bx * py - px * by, bx * ay - ax * by);
    const aPresses = (bx * py - px * by) / (bx * ay - ax * by);
    const bPresses = (px - ax * aPresses) / bx;
    if (aPresses % 1 == 0 && bPresses % 1 == 0) {
        tokens += aPresses * 3 + bPresses;
    }
}

console.log(tokens);

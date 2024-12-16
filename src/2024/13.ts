#!/usr/bin/env -S deno run

import fs from "node:fs";

const input = fs.readFileSync(0, { encoding: "utf8" });

let totalTokens = 0;
for (const machine of input.split("\n\n")) {
    const [ax, ay, bx, by, px, py] = machine.matchAll(/\d+/g)
        .map((m) => parseInt(m[0]));

    for (let i = 100; i >= 0; i--) {
        // assume pressing B is always optimal
        // (it is in terms of pure cost, at least)
        const x = bx * i;
        const y = by * i;

        if (x > px || y > py) {
            continue;
        }

        if (x == px && y == py) {
            // we didn't even need the A button!
            totalTokens += i;
            break;
        }

        const dx = px - x, dy = py - y;
        if (dx % ax == 0 && dy % ay == 0 && dx / ax == dy / ay) {
            totalTokens += i + 3 * (dx / ax);
            break;
        }
    }
}

console.log(totalTokens);

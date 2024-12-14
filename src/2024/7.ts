#!/usr/bin/env -S deno run

import fs from "node:fs";

const input = fs.readFileSync(0, { encoding: "utf8" });

function possible(result: number, operands: number[]): boolean {
    if (operands.length == 1) {
        return result == operands[0];
    }

    const [o1, o2, ...ox] = operands;
    return possible(result, [o1 + o2, ...ox]) ||
        possible(result, [o1 * o2, ...ox]) ||
        possible(result, [Number(`${o1}${o2}`), ...ox]);
}

let sum = 0;
for (const equation of input.split("\n").slice(0, -1)) {
    const [result, ...operands] = equation.split(/\D+/).map(Number);
    if (possible(result, operands)) {
        sum += result;
    }
}

console.log(sum);

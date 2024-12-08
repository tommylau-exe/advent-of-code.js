#!/usr/bin/env -S deno run

// parse stdin as utf-8 text
const decoder = new TextDecoder();
const buffer = new Uint8Array(2 ** 16); // 64KiB
let input = "";
while (Deno.stdin.readSync(buffer)) {
    input += decoder.decode(buffer);
}

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

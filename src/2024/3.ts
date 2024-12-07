#!/usr/bin/env -S deno run

// parse stdin as utf-8 text
const decoder = new TextDecoder();
const buffer = new Uint8Array(2 ** 16); // 64KiB
let input = "";
while (Deno.stdin.readSync(buffer)) {
    input += decoder.decode(buffer);
}

let sum = 0;
let mulEnabled = true;
for (
    const [_, enable, disable, mul, n1, n2] of input.matchAll(
        /(do)\(\)|(don't)\(\)|(mul)\((\d+),(\d+)\)/g,
    )
) {
    if (enable) {
        mulEnabled = true;
    } else if (disable) {
        mulEnabled = false;
    } else if (mulEnabled && mul) {
        sum += parseInt(n1) * parseInt(n2);
    }
}

console.log(sum);

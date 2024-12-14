#!/usr/bin/env -S deno run

import fs from "node:fs";

const input = fs.readFileSync(0, { encoding: "utf8" });

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

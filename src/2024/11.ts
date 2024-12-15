#!/usr/bin/env -S deno run

import fs from "node:fs";

const input = fs.readFileSync(0, { encoding: "utf8" });

const cache = new Map<string, number>();
function blink(n: string, iter: number): number {
    if (n.length == 0) {
        return 0;
    }

    if (iter == 0) {
        return 1;
    }

    const key = `${n},${iter}`;
    if (cache.has(key)) {
        return cache.get(key)!;
    }

    let n1 = "", n2 = "";
    if (n == "0") {
        n1 = "1";
    } else if (n.length % 2 == 0) {
        n1 = n.slice(0, n.length / 2);
        n2 = parseInt(n.slice(n.length / 2)).toString(); // drop leading zeroes
    } else {
        n1 = (parseInt(n) * 2024).toString();
    }

    cache.set(key, blink(n1, iter - 1) + blink(n2, iter - 1));
    return cache.get(key)!;
}

const stones = input.split(/\s+/).slice(0, -1);
let count = 0;
for (const stone of stones) {
    count += blink(stone, 75);
}

console.log(count);

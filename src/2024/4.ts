#!/usr/bin/env -S deno run

import fs from "node:fs";

const input = fs.readFileSync(0, { encoding: "utf8" });

const crossword = input.split("\n").slice(0, -1);
function letter([x, y]: [number, number]): string | undefined {
    return crossword[y] && crossword[y][x];
}

let occurrences = 0;
for (let y = 0; y < crossword.length; y++) {
    for (let x = 0; x < crossword[y].length; x++) {
        if (letter([x, y]) != "A") {
            continue;
        }

        const ne = letter([x + 1, y - 1]);
        const nw = letter([x - 1, y - 1]);
        const se = letter([x + 1, y + 1]);
        const sw = letter([x - 1, y + 1]);

        if (
            [ne, nw, se, sw].every((c) => c == "M" || c == "S") && ne != sw &&
            nw != se
        ) {
            occurrences++;
        }
    }
}

console.log(occurrences);

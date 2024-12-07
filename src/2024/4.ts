#!/usr/bin/env -S deno run

// parse stdin as utf-8 text
const decoder = new TextDecoder();
const buffer = new Uint8Array(2 ** 16); // 64KiB
let input = "";
while (Deno.stdin.readSync(buffer)) {
    input += decoder.decode(buffer);
}

const crossword = input.split("\n").slice(0, -1);
function* word([x, y]: [number, number], [dx, dy]: [number, number]) {
    while (crossword[y] && crossword[y][x]) {
        yield crossword[y][x];
        x += dx;
        y += dy;
    }
}

let occurrences = 0;
for (let y = 0; y < crossword.length; y++) {
    for (let x = 0; x < crossword[y].length; x++) {
        for (
            const dir of [[1, 0], [1, 1], [0, 1], [-1, 1]] as [number, number][]
        ) {
            const w = [...word([x, y], dir).take(4)].join("");
            if (w == "XMAS" || w == "SAMX") {
                occurrences++;
            }
        }
    }
}

console.log(occurrences);

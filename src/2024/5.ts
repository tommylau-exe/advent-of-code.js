#!/usr/bin/env -S deno run

// parse stdin as utf-8 text
const decoder = new TextDecoder();
const buffer = new Uint8Array(2 ** 16); // 64KiB
let input = "";
while (Deno.stdin.readSync(buffer)) {
    input += decoder.decode(buffer);
}

const lines = input.split("\n").slice(0, -1);
const separator = lines.findIndex((line) => line == "");
const rulesSection = lines.slice(0, separator);
const updatesSection = lines.slice(separator + 1);

const rules = new Map<number, Set<number>>();
for (const rule of rulesSection) {
    const [n1, n2] = rule.split("|").map(Number);
    if (!rules.has(n1)) {
        rules.set(n1, new Set());
    }

    rules.get(n1)!.add(n2);
}

let pageSum = 0;
updates: for (const update of updatesSection) {
    const pages = update.split(",").map(Number);
    for (let i = 0; i < pages.length; i++) {
        if (!rules.has(pages[i])) {
            continue;
        }

        const prevNums = new Set(pages.slice(0, i));
        if (rules.get(pages[i])!.intersection(prevNums).size > 0) {
            continue updates;
        }
    }

    pageSum += pages[Math.floor(pages.length / 2)];
}

console.log(pageSum);

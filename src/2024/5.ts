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
for (const update of updatesSection) {
    const pages = update.split(",").map(Number);
    let reordered = false;
    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        if (!rules.has(page)) {
            continue;
        }

        // while there are pages that should've been after page j, swap it with
        // the element before it
        let j = i;
        while (
            rules.get(page)!.intersection(new Set(pages.slice(0, j))).size > 0
        ) {
            reordered = true;

            const tmp = pages[j - 1];
            pages[j - 1] = pages[j];
            pages[j] = tmp;

            j--;
        }
    }

    if (reordered) {
        pageSum += pages[Math.floor(pages.length / 2)];
    }
}

console.log(pageSum);

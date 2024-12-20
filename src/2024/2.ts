#!/usr/bin/env -S deno run

import fs from "node:fs";

const input = fs.readFileSync(0, { encoding: "utf8" });

// naively check if a report is safe (no dampening)
function isSafe(report: number[]): boolean {
    let lastLevel = report[0];
    const increasing = report[1] - report[0] > 0;
    for (const level of report.slice(1)) {
        const diff = level - lastLevel;
        if (
            increasing !== diff > 0 || Math.abs(diff) < 1 || Math.abs(diff) > 3
        ) {
            return false;
        }

        lastLevel = level;
    }

    return true;
}

// generate all permutations of dampened reports
function* permutations(report: number[]) {
    yield report;

    for (
        let indexToRemove = 0; indexToRemove < report.length; indexToRemove++
    ) {
        yield report.toSpliced(indexToRemove, 1);
    }
}

const safeReports = input.split("\n").slice(0, -1).map((line) =>
    line.split(" ").map((n) => parseInt(n))
).filter((report) => permutations(report).find((report) => isSafe(report)));

console.log(safeReports.length);

#!/usr/bin/env -S deno run

import fs from "node:fs";

const input = fs.readFileSync(0, { encoding: "utf8" });

// build up block map
const diskMap = input.split("\n")[0];
const blocks = new Array<number | null>();
let fileID = -1;
for (let i = 0; i < diskMap.length; i++) {
    if (i % 2 == 0) {
        fileID++;
    }

    let blockLength = parseInt(diskMap[i]);
    while (blockLength--) {
        blocks.push(i % 2 == 0 ? fileID : null);
    }
}

// compact blocks
let i = blocks.length - 1;
while (fileID) {
    while (blocks[i] != fileID) {
        i--;
    }
    const fileEnd = i + 1;

    while (blocks[i] == fileID) {
        i--;
    }
    const fileBeg = i + 1;
    const fileLen = fileEnd - fileBeg;

    let emptyBeg = 0;
    let emptyEnd = 0;
    while (emptyBeg < fileBeg) {
        if (blocks[emptyBeg] !== null) {
            // find next empty space
            emptyBeg++;
            emptyEnd++;
        } else if (blocks[emptyEnd] === null) {
            // find end of empty space
            emptyEnd++;
        } else if (emptyEnd - emptyBeg < fileLen) {
            // empty space too small, check next one
            emptyBeg = emptyEnd;
        } else {
            // found a suitable space
            break;
        }
    }

    if (emptyBeg < fileBeg) {
        // move file into place
        for (let i = 0; i < fileLen; i++) {
            blocks[fileBeg + i] = null;
            blocks[emptyBeg + i] = fileID;
        }
    }

    fileID--;
}

// calculate checksum
let checksum = 0;
for (let pos = 0; pos < blocks.length; pos++) {
    checksum += pos * (blocks[pos] ?? 0);
}

console.log(checksum);

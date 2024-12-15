#!/usr/bin/env -S deno run

import fs from "node:fs";

const input = fs.readFileSync(0, { encoding: "utf8" });
const map = input.split("\n").slice(0, -1);

// get nearby neighbors in the same region
function* neighbors(x: number, y: number) {
    const offsets = [[-1, 0], [0, -1], [1, 0], [0, 1]];
    for (const [dx, dy] of offsets) {
        const nx = x + dx, ny = y + dy;
        if (map[ny] && map[ny][nx] == map[y][x]) {
            yield [nx, ny];
        }
    }
}

// give every region a unique identifier
let regionID = 0;
const coordToRegion = new Map<string, number>();
for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
        if (coordToRegion.has(`${x},${y}`)) {
            continue;
        }

        regionID++;

        const stack = [[x, y]];
        while (stack.length > 0) {
            const [x, y] = stack.pop()!;
            if (coordToRegion.has(`${x},${y}`)) {
                continue;
            }

            coordToRegion.set(`${x},${y}`, regionID);
            stack.push(...neighbors(x, y));
        }
    }
}

// calculate areas
const regionToArea = new Map<number, number>();
for (const region of coordToRegion.values()) {
    regionToArea.set(region, (regionToArea.get(region) ?? 0) + 1);
}

// calculate sides
const regionToSides = new Map<number, number>();
for (let r = 1; r <= regionID; r++) {
    let sides = 0;
    // detect horizontal sides
    for (let y = -1; y < map.length; y++) {
        let prevSide: boolean | null = null;
        for (let x = 0; x < map[0].length; x++) {
            const r1 = coordToRegion.get(`${x},${y}`) ?? 0;
            const r2 = coordToRegion.get(`${x},${y + 1}`) ?? 0;

            let side: boolean | null = null;
            if (r1 == r && r1 != r2) {
                side = false;
            } else if (r2 == r && r1 != r2) {
                side = true;
            }

            if (side != null && prevSide != side) {
                sides++;
            }

            prevSide = side;
        }
    }

    // detect vertical sides
    for (let x = -1; x < map[0].length; x++) {
        let prevSide: boolean | null = null;
        for (let y = 0; y < map.length; y++) {
            const r1 = coordToRegion.get(`${x},${y}`) ?? 0;
            const r2 = coordToRegion.get(`${x + 1},${y}`) ?? 0;

            let side: boolean | null = null;
            if (r1 == r && r1 != r2) {
                side = false;
            } else if (r2 == r && r1 != r2) {
                side = true;
            }

            if (side != null && prevSide != side) {
                sides++;
            }

            prevSide = side;
        }
    }

    regionToSides.set(r, sides);
}

let price = 0;
for (let r = 1; r <= regionID; r++) {
    price += regionToArea.get(r)! * regionToSides.get(r)!;
}

console.log(price);

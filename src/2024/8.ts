#!/usr/bin/env -S deno run

// parse stdin as utf-8 text
const decoder = new TextDecoder();
const buffer = new Uint8Array(2 ** 16); // 64KiB
let input = "";
while (Deno.stdin.readSync(buffer)) {
    input += decoder.decode(buffer);
}

const map = input.split("\n").slice(0, -1);

// build a map of antennas to their positions
const antennas = new Map<string, [number, number][]>();
for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] == ".") {
            continue;
        }

        if (!antennas.has(map[y][x])) {
            antennas.set(map[y][x], []);
        }

        antennas.get(map[y][x])!.push([x, y]);
    }
}

// simple Set-backed data structure to store antinodes
const antinodes = {
    positions: new Set<number>(),
    add(x: number, y: number): boolean {
        if (y < 0 || y >= map.length || x < 0 || x >= map[y].length) {
            return false;
        }

        this.positions.add(map[y].length * y + x);
        return true;
    },
    get count() {
        return this.positions.size;
    },
};

for (const antennaPos of antennas.values()) {
    for (let i = 0; i < antennaPos.length; i++) {
        for (let j = i + 1; j < antennaPos.length; j++) {
            const [x1, y1] = antennaPos[i];
            const [x2, y2] = antennaPos[j];
            const [dx, dy] = [x2 - x1, y2 - y1];

            let x = x1, y = y1;
            while (antinodes.add(x, y)) {
                x -= dx;
                y -= dy;
            }

            x = x2, y = y2;
            while (antinodes.add(x, y)) {
                x += dx;
                y += dy;
            }
        }
    }
}

console.log(antinodes.count);

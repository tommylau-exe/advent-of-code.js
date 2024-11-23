#!/usr/bin/env node

import { readFileSync } from 'node:fs';

const lines = readFileSync(0, { encoding: 'utf8' }).split('\n').slice(0, -1);

let sum = 0;
for (let r = 0; r < lines.length; r++) {
	for (let c = 0; c < lines[r].length; c++) {
		// skip non-gears
		if (lines[r][c] !== '*') {
			continue;
		}

		// iterate over surrounding characters, tracking part numbers
		let pn1, pn2;
		const visited = new Set();
		for (let dr = -1; dr <= 1; dr++) {
			// iterate through columns in reverse to ensure we mark characters
			// as "visited" in the correct order
			for (let dc = 1; dc >= -1; dc--) {
				const nr = r + dr;
				let nc = c + dc;

				// skip out of bounds spaces
				if (nr < 0 || nr >= lines.length || nc < 0 || nc >= lines[nr].length) {
					continue;
				}

				// skip visited or non-number characters
				if (visited.has(nr * lines[nr].length + nc) || isNaN(lines[nr][nc])) {
					continue;
				}

				// find the start of the part number
				while (nc >= 0 && !isNaN(lines[nr][nc])) {
					visited.add(nr * lines[nr].length + nc);
					nc--;
				}
				nc++; // loop will overshoot by one

				const pn = Number(lines[nr].slice(nc).match(/\d+/));
				if (!pn1) {
					pn1 = pn;
				} else {
					pn2 = pn;
				}
			}
		}

		if (pn1 && pn2) {
			sum += pn1 * pn2;
		}
	}
}

console.log(sum);

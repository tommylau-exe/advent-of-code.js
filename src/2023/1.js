#!/usr/bin/env node

import { readFileSync } from 'node:fs';

const lines = readFileSync(0, { encoding: 'utf8' }).split('\n').slice(0, -1);
const digitToSpelled = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

let sum = 0;
for (const line of lines) {
	let firstDigit, lastDigit;
	for (let offset = 0; offset < line.length; offset++) {
		// parse the given digit
		let d = 1;
		while (d <= 9 && line[offset] !== d.toString() && !line.startsWith(digitToSpelled[d - 1], offset)) {
			d++;
		}

		if (d > 9) {
			// failed to parse
			continue;
		}

		firstDigit ||= d;
		lastDigit = d;
	}

	sum += 10 * firstDigit + lastDigit;
}

console.log(sum);

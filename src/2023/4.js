#!/usr/bin/env node

import { readFileSync } from 'node:fs';

const lines = readFileSync(0, { encoding: 'utf8' }).split('\n').slice(0, -1);
const cardCounts = new Array(lines.length).fill(1);
for (let i = 0; i < lines.length; i++) {
	const [myNumbers, winningNumbers] = lines[i].split(/\:\s+/)[1].split(/\s+\|\s+/)
		.map(nums => nums.split(/\s+/)
			.map(num => Number(num)));

	let points = 0;
	for (const num of myNumbers) {
		if (winningNumbers.includes(num)) {
			points++;
		}
	}

	for (let j = 0; j < points; j++) {
		cardCounts[i + j + 1] += cardCounts[i];
	}
}

let totalCards = 0;
for (const count of cardCounts.values()) {
	totalCards += count;
}

console.log(totalCards);

#!/usr/bin/env node

import { readFileSync } from 'node:fs';

const games = readFileSync(0, { encoding: 'utf8' }).split('\n').slice(0, -1);

let sum = 0;
for (const game of games) {
	const groups = game.split(': ')[1].split(/, |; /);

	// compute the minimum possible number of cubes required to make the games possible
	const minCubes = { red: 0, green: 0, blue: 0 };
	for (const group of groups) {
		const [cubes, color] = group.split(' ');
		minCubes[color] = Math.max(minCubes[color], cubes);
	}

	const power = minCubes.red * minCubes.green * minCubes.blue;
	sum += power;
}

console.log(sum)

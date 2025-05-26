import assert from "assert";

export class Tableau<T> {
	private rounds: Map<number, T[]>;
	private startingRound: number;
	private nextRound: number;
	constructor(startingRound: number) {
		assert(
			powersOf2.includes(startingRound),
			`Starting round (${startingRound}) is not a power of 2`
		);
		this.startingRound = startingRound;
		this.rounds = new Map<number, T[]>();
		this.nextRound = startingRound;
	}
	addRoundInOrder(values: T[]) {
		assert(
			values.length == this.nextRound / 2,
			`Values length (${values.length}) does not match round (${
				this.nextRound / 2
			})`
		);
		assert(this.nextRound > 0, `Next round (${this.nextRound}) is 0`);
		this.rounds.set(this.nextRound, values);
		this.nextRound /= 2;
	}
	toString() {
		let round = this.startingRound;
		let str = "Tableau:\n";
		while (round != 1) {
			const values = this.rounds.get(round);
			if (values) {
				str += `Round ${round}: [${values.map(
					el => JSON.stringify(el) + ",\n "
				)}]\n`;
			}
			round = Tableau.getNextRound(round);
		}
		return str;
	}
	print() {
		let round = this.startingRound;
		console.log("Tableau:");
		while (round != 1) {
			const values = this.rounds.get(round);
			console.log(`Round ${round}:`, values);
			round = Tableau.getNextRound(round);
		}
	}
	private static getNextRound(round: number) {
		assert(
			powersOf2.includes(round),
			`Round (${round}) is not a power of 2`
		);
		return round / 2;
	}
}

const powersOf2 = [1, 2, 4, 8, 16, 32, 64, 128, 256];

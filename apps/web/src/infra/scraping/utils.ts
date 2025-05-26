export function createWeaponParser<K extends string>({
	foil,
	epee,
	saber,
}: {
	foil: [string, K];
	epee: [string, K];
	saber: [string, K];
}) {
	return (weapon: string): K => {
		switch (weapon) {
			case foil[0]:
				return foil[1];
			case epee[0]:
				return epee[1];
			case saber[0]:
				return saber[1];
			default:
				throw new Error(`Unexpected weapon to parse: '${weapon}'`);
		}
	};
}

export function filterEven<T>(nodes: T[]): T[] {
	return nodes.filter((_, index) => index % 2 == 0);
}
export function filterOdd<T>(nodes: T[]): T[] {
	return nodes.filter((_, index) => index % 2 == 1);
}

export function splitArray<T>(yourArray: T[]): [T[], T[]] {
	const halfwayThrough = Math.floor(yourArray.length / 2);
	// or instead of floor you can use ceil depending on what side gets the extra data

	const arrayFirstHalf = yourArray.slice(0, halfwayThrough);
	const arraySecondHalf = yourArray.slice(halfwayThrough, yourArray.length);
	return [arrayFirstHalf, arraySecondHalf];
}

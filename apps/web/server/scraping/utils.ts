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

import axios from "axios";
import {
	getCountriesWithMissingIsoCodeOrName,
	insertCountriesWithIocCode,
	updateCountryData,
} from "./queries";

const getUrl = (iocCode: string) =>
	`https://restcountries.com/v3.1/alpha?codes=${iocCode.toLowerCase()}`;

async function requestCountryInfo(iocCode: string) {
	const url = getUrl(iocCode);
	const response = await axios.get(url);
	return response.data[0];
}

export async function getCountryData(
	iocCode: string
): Promise<{ isoCode: string; name: string }> {
	console.log("getting data for: " + iocCode);
	try {
		const data = await requestCountryInfo(iocCode);
		return { isoCode: data.cca2, name: data.name.common };
	} catch (e) {
		throw new Error(`Error getting flag for '${iocCode}'. Error: ${e}`);
	}
}

export async function saveCountries(newCountries: { iocCode: string }[]) {
	await insertCountriesWithIocCode(newCountries);
	await updateCountries();
}

export async function updateCountries() {
	const missingIsoCode = await getCountriesWithMissingIsoCodeOrName();
	if (missingIsoCode.length == 0) {
		return;
	}
	const updated = await Promise.all(
		missingIsoCode.map(async row => {
			const data = await getCountryData(row.iocCode);
			return {
				isoCode: data.isoCode,
				iocCode: row.iocCode,
				name: data.name,
			};
		})
	);
	console.log("update countries");
	await updateCountryData(updated);
}

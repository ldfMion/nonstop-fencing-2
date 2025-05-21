import axios from "axios";
import {
	getCountriesWithMissingIsoCode,
	insertCountriesWithIocCode,
	updateIsoCode,
} from "./queries";

const getUrl = (iocCode: string) =>
	`https://restcountries.com/v3.1/alpha?codes=${iocCode.toLowerCase()}`;

export async function getIsoCodeFromIocCode(iocCode: string): Promise<string> {
	console.log("getting iso code for: " + iocCode);
	const url = getUrl(iocCode);
	console.log(url);
	try {
		const response = await axios.get(url);
		return response.data[0].cca2;
	} catch (e) {
		console.error(`Error getting flag for '${iocCode}'. Error: ${e}`);
		return "--";
	}
}

export async function saveCountries(newCountries: { iocCode: string }[]) {
	await insertCountriesWithIocCode(newCountries);
	const missingIsoCode = await getCountriesWithMissingIsoCode();
	if (missingIsoCode.length == 0) {
		return;
	}
	const updated = await Promise.all(
		missingIsoCode.map(async row => ({
			isoCode: await getIsoCodeFromIocCode(row.iocCode),
			iocCode: row.iocCode,
		}))
	);
	console.log("update countries");
	await updateIsoCode(updated);
}

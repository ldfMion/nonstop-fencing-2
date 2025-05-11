import axios from "axios";

const getUrl = (iocCode: string) =>
	`https://restcountries.com/v3.1/alpha?codes=${iocCode}`;

export async function getIsoCodeFromIocCode(iocCode: string): Promise<string> {
	console.log("getting iso code");
	const response = await axios.get(getUrl(iocCode));
	return response.data[0].cca2;
}

console.log(await getIsoCodeFromIocCode("USA"));

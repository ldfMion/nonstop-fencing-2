export {};

console.log("Hello, world!");

const COMPETITIONS_ENDPOINT = "https://fie.org/competitions/search";
async function fetchCompetitions() {
	const body = {
		competitionCategory: "",
		fetchPage: 1,
		fromDate: "",
		gender: [],
		level: "s",
		name: "",
		season: "2025",
		status: "",
		toDate: "",
		type: [],
		weapon: [],
	};
	const response = await fetch(COMPETITIONS_ENDPOINT, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});
	console.log(response);
	const data = await response.json();
	console.log(data.items);
}

async function getEventBouts() {
	const url = "https://fie.org/competitions/2025/121";
}

getEventBouts();

import { countries } from "~/infra/db/schema";
import { db } from "~/infra/db";
import { sql, eq, isNull, not, type SQL, inArray, and } from "drizzle-orm";

export async function insertCountriesWithIocCode(
	newCountries: { iocCode: string; isoCode?: string }[]
) {
	console.log(
		await db.insert(countries).values(newCountries).onConflictDoNothing()
	);
}

export async function getCountriesWithMissingIsoCode() {
	return db
		.select({ iocCode: countries.iocCode })
		.from(countries)
		.where(
			and(isNull(countries.isoCode), not(eq(countries.iocCode, "AIN")))
		);
}

export async function updateIsoCode(
	updatedCountries: { iocCode: string; isoCode: string }[]
) {
	const sqlChunks: SQL[] = [];
	sqlChunks.push(sql`(case`);
	sqlChunks.push(
		...updatedCountries.map(
			row =>
				sql`when ${countries.iocCode} = ${row.iocCode} then ${row.isoCode}`
		)
	);
	const iocCodes: string[] = updatedCountries.map(row => row.iocCode);
	sqlChunks.push(sql`end)`);
	const finalSql: SQL = sql.join(sqlChunks, sql.raw(" "));
	console.log(
		await db
			.update(countries)
			.set({ isoCode: finalSql })
			.where(inArray(countries.iocCode, iocCodes))
	);
}

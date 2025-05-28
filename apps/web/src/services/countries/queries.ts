import {
	competitionsWithFlag,
	competitionsWithFlagsAndEvents,
	countries,
} from "~/infra/db/schema";
import { db } from "~/infra/db";
import { sql, eq, isNull, not, type SQL, inArray, and, or } from "drizzle-orm";

export async function insertCountriesWithIocCode(
	newCountries: { iocCode: string; isoCode?: string }[]
) {
	console.log(
		await db.insert(countries).values(newCountries).onConflictDoNothing()
	);
}

export async function getCountriesWithMissingIsoCodeOrName() {
	return db
		.select({ iocCode: countries.iocCode })
		.from(countries)
		.where(
			and(
				or(isNull(countries.isoCode), isNull(countries.name)),
				not(eq(countries.iocCode, "AIN"))
			)
		);
}

export async function updateCountryData(
	updatedCountries: { iocCode: string; isoCode: string; name: string }[]
) {
	const isoSqlChunks: SQL[] = [];
	isoSqlChunks.push(sql`(case`);
	isoSqlChunks.push(
		...updatedCountries.map(
			row =>
				sql`when ${countries.iocCode} = ${row.iocCode} then ${row.isoCode}`
		)
	);
	const iocCodes: string[] = updatedCountries.map(row => row.iocCode);
	isoSqlChunks.push(sql`end)`);
	const finalIsoSql: SQL = sql.join(isoSqlChunks, sql.raw(" "));

	const nameSqlChunks: SQL[] = [];
	nameSqlChunks.push(sql`(case`);
	nameSqlChunks.push(
		...updatedCountries.map(
			row =>
				sql`when ${countries.iocCode} = ${row.iocCode} then ${row.name}`
		)
	);
	nameSqlChunks.push(sql`end)`);
	const finalNameSql: SQL = sql.join(nameSqlChunks, sql.raw(" "));

	console.log(
		await db
			.update(countries)
			.set({ isoCode: finalIsoSql, name: finalNameSql })
			.where(inArray(countries.iocCode, iocCodes))
	);
	await db.refreshMaterializedView(competitionsWithFlag);
	await db.refreshMaterializedView(competitionsWithFlagsAndEvents);
}

import { AnyColumn, GetColumnData, sql } from "drizzle-orm";

export function arrayAgg<Col extends AnyColumn>(column: Col) {
	return sql<
		GetColumnData<Col, "raw">[]
	>`array_agg(distinct ${sql`${column}`}) filter (where ${column} is not null)`;
}

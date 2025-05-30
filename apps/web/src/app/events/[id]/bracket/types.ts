import { Round } from "~/lib/models";

export type Match<T> = { round: Round; order: number } & (T | {});

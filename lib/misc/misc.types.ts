export type NonNullableArray<T> =
	T extends Array<infer U> ? (U extends null | undefined ? never : U) : never;

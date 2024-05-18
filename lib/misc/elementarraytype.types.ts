export type ArrayElementType<T> = T extends (infer U)[]
	? U
	: T extends readonly (infer U)[]
		? U
		: never;

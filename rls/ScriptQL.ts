let count = -1;

// Made with chatgpt
function convertToLetter(number: number): string {
	let letter = "";

	while (number >= 0) {
		letter = String.fromCharCode(97 + (number % 26)) + letter;
		number = Math.floor(number / 26) - 1;
	}

	return letter;
}

/** And */
export const AND = (...params: (string | boolean)[]) => {
	return `(${params
		.map((p) => (typeof p == "boolean" ? (p ? "TRUE" : "FALSE") : p))
		.join(") AND (")})`;
};

/** Or */
export const OR = (...params: (string | boolean)[]) => {
	return `(${params
		.map((p) => (typeof p == "boolean" ? (p ? "TRUE" : "FALSE") : p))
		.join(") OR (")})`;
};

/** Equal */
export const EQ = (key: string | boolean, value: string | boolean) => {
	return `(${typeof key == "boolean" ? (key ? "TRUE" : "FALSE") : key} = ${
		typeof value == "boolean" ? (value ? "TRUE" : "FALSE") : value
	})`;
};

/** Is */
export const IS = (key: string | boolean, value: string | boolean) => {
	return `(${typeof key == "boolean" ? (key ? "TRUE" : "FALSE") : key} IS ${
		typeof value == "boolean" ? (value ? "TRUE" : "FALSE") : value
	})`;
};

/** Not equal */
export const NEQ = (key: string | boolean, value: string | boolean) => {
	return `(${typeof key == "boolean" ? (key ? "TRUE" : "FALSE") : key} != ${
		typeof value == "boolean" ? (value ? "TRUE" : "FALSE") : value
	})`;
};

/** Is not */
export const NIS = (key: string | boolean, value: string | boolean) => {
	return `(${typeof key == "boolean" ? (key ? "TRUE" : "FALSE") : key} IS NOT ${
		typeof value == "boolean" ? (value ? "TRUE" : "FALSE") : value
	})`;
};

/** Greater than */
export const GT = (key: string | boolean, value: string | boolean) => {
	return `(${typeof key == "boolean" ? (key ? "TRUE" : "FALSE") : key} > ${
		typeof value == "boolean" ? (value ? "TRUE" : "FALSE") : value
	})`;
};

/** Greater than or equal */
export const GTE = (key: string | boolean, value: string | boolean) => {
	return `(${typeof key == "boolean" ? (key ? "TRUE" : "FALSE") : key} >= ${
		typeof value == "boolean" ? (value ? "TRUE" : "FALSE") : value
	})`;
};

/** Less than */
export const LT = (key: string | boolean, value: string | boolean) => {
	return `(${typeof key == "boolean" ? (key ? "TRUE" : "FALSE") : key} < ${
		typeof value == "boolean" ? (value ? "TRUE" : "FALSE") : value
	})`;
};

/** Less than or equal */
export const LTE = (key: string | boolean, value: string | boolean) => {
	return `(${typeof key == "boolean" ? (key ? "TRUE" : "FALSE") : key} <= ${
		typeof value == "boolean" ? (value ? "TRUE" : "FALSE") : value
	})`;
};

/** In */
export const IN = (key: string | boolean, value: string | boolean) => {
	return `(${typeof key == "boolean" ? (key ? "TRUE" : "FALSE") : key} IN ${
		typeof value == "boolean" ? (value ? "TRUE" : "FALSE") : value
	})`;
};

/** Select
 * For the filter use $ to refer to the table
 * Example: EQ("$.id", "auth.uid()")
 */
export const SELECT = (
	table: string,
	properties: string[],
	filter = "TRUE"
) => {
	count++;
	const tableLetter = convertToLetter(count);
	return `(SELECT ${properties
		.map((p) => `${tableLetter}.${p}`)
		.join(", ")} FROM ${table} ${tableLetter} WHERE (${filter.replace(
		/\$/g,
		tableLetter
	)}))`;
};

export class Policy {
	public readonly name: string;
	public readonly query: string;
	public readonly description?: string;
	public readonly author?: string;
	public readonly table?: string;

	constructor({
		name,
		query,
		description,
		author,
		table,
	}: {
		name: string;
		query: string;
		description?: string;
		author?: string;
		table?: string;
	}) {
		this.name = name;
		this.query = query;
		this.description = description;
		this.author = author;
		this.table = table;
	}
}

export const savePolicies = async (file: string, ...policies: Policy[]) => {
	// NodeJS polyfill
	const deno = ((globalThis as { [key: string]: unknown }).Deno as {
		writeTextFile: (file: string, content: string) => Promise<void>;
	}) ?? {
		writeTextFile: async (file: string, content: string) => {
			// eslint-disable-next-line no-console
			console.log("Why are you running this in node?");
			throw new Error("Run this with `Deno task export`")
		},
	};

	await deno.writeTextFile(
		file,
		[
			"-- Built with ScriptQL",
			"",
			"-- Exported queries",
			"",
			...policies.map((policy) =>
				[
					`-- ${policy.name}`,
					policy.table ? `-- For table ${policy.table}` : undefined,
					policy.description ? `-- ${policy.description}` : undefined,
					policy.author ? `-- By ${policy.author}` : undefined,
					policy.query,
					"",
				]
					.filter((l) => l != undefined)
					.join("\n")
			),
		].join("\n")
	);
};

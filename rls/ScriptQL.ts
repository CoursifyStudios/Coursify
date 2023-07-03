let count = -1;

// Nodejs Polyfill
interface Deno {
	writeTextFile: (file: string, content: string) => Promise<void>;
}

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
export const AND = (...params: string[]) => {
	return `(${params.join(") AND (")})`;
};

/** Or */
export const OR = (...params: string[]) => {
	return `(${params.join(") OR (")})`;
};

/** Equal */
export const EQ = (key: string, value: string) => {
	return `(${key} = ${value})`;
};

/** Is */
export const IS = (key: string, value: string) => {
	return `(${key} IS ${value})`;
};

/** Not equal */
export const NEQ = (key: string, value: string) => {
	return `(${key} != ${value})`;
};

/** Is not */
export const NIS = (key: string, value: string) => {
	return `(${key} IS NOT ${value})`;
};

/** Greater than */
export const GT = (key: string, value: string) => {
	return `(${key} > ${value})`;
};

/** Greater than or equal */
export const GTE = (key: string, value: string) => {
	return `(${key} >= ${value})`;
};

/** Less than */
export const LT = (key: string, value: string) => {
	return `(${key} < ${value})`;
};

/** Less than or equal */
export const LTE = (key: string, value: string) => {
	return `(${key} <= ${value})`;
};

/** In */
export const IN = (key: string, value: string) => {
	return `(${key} IN ${value})`;
};

/** Select
 * For the filter use $ to refer to the table
 * Example: EQ("$.id", "auth.uid()")
 */
export const SELECT = (
	table: string,
	properties: string[],
	filter = "true"
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
	await Deno.writeTextFile(
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

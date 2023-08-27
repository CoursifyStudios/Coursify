const licenses: Record<string, string[]> = {};

// NodeJS polyfill
const deno = ((globalThis as { [key: string]: unknown }).Deno as {
	writeTextFile: (file: string, content: string) => Promise<void>;
	readTextFile: (file: string) => Promise<string>;
	readDir: (folder: string) => AsyncIterableIterator<{
		name: string;
		isFile: boolean;
		isDirectory: boolean;
		isSymlink: boolean;
	}>;
}) ?? {
	// deno-lint-ignore require-await
	writeTextFile: async (_file: string, _content: string) => {
		// eslint-disable-next-line no-console
		console.log("Why are you running this in node?");
		throw new Error("Run this script in deno (deno task)");
	},
	// deno-lint-ignore require-await
	readTextFile: async (_file: string) => {
		// eslint-disable-next-line no-console
		console.log("Why are you running this in node?");
		throw new Error("Run this script in deno (deno task)");
	},
	// deno-lint-ignore require-await
	readDir: async (_folder: string) => {
		// eslint-disable-next-line no-console
		console.log("Why are you running this in node?");
		throw new Error("Run this script in deno (deno task)");
	},
};

const isFile = async (path: string) => {
	try {
		const info = await deno.readTextFile(path);
		return info;
	} catch {
		return undefined;
	}
};

const fetchLicense = (
	licenseField:
		| string
		| Record<string, string>
		| string[]
		| Record<string, string>[]
): string | string[] => {
	if (typeof licenseField == "string") {
		return licenseField;
	}
	if (Array.isArray(licenseField)) {
		return licenseField.map((license) => fetchLicense(license) as string);
	}
	if (typeof licenseField == "object") {
		// types my beloved
		const licenseFieldObject = licenseField as Record<string, string>;
		if (licenseFieldObject.type != undefined) {
			return licenseFieldObject.type;
		}
		if (licenseFieldObject.name != undefined) {
			return licenseFieldObject.name;
		}
	}
	return "unknown";
};

const walkFolder = async (folder: string, packageRoot?: string) => {
	for await (const directory of deno.readDir(folder)) {
		if (!directory.isDirectory) continue;
		if ([".bin", ".cache"].includes(directory.name)) continue;
		const packageJson = await isFile(
			`${folder}/${directory.name}/package.json`
		);
		if (packageJson != undefined) {
			const packageInfo = JSON.parse(packageJson);
			if (
				packageInfo.license != undefined ||
				packageInfo.licenses != undefined
			) {
				const licenseData = fetchLicense(
					packageInfo.license ?? packageInfo.licenses
				);
				const licenseList = Array.isArray(licenseData)
					? licenseData
					: [licenseData];
				for (const license of licenseList) {
					licenses[license] ??= [];
					licenses[license].push(
						`${packageRoot != undefined ? `${packageRoot}/` : ""}${
							directory.name
						}`
					);
				}
				continue;
			} else {
				// eslint-disable-next-line no-console
				console.log(
					`${packageRoot != undefined ? `${packageRoot}/` : ""}${
						directory.name
					} has no license`
				);
				licenses["Unknown"] ??= [];
				licenses["Unknown"].push(
					`${packageRoot != undefined ? `${packageRoot}/` : ""}${
						directory.name
					}`
				);
			}
		} else {
			if (packageRoot == undefined) {
				await walkFolder(`${folder}/${directory.name}`, directory.name);
			}
		}
	}
};

await walkFolder("../node_modules");

await deno.writeTextFile(
	"../public/licenses.json",
	JSON.stringify(licenses, null, 2)
);

// Made node happy or whatever
export {};

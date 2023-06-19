export function normalizeURLs(urls: string[]): string[] {
	return urls.map((url) => {
		// Remove any leading/trailing whitespace
		url = url.trim();

		// Remove any leading/trailing slashes
		url = url.replace(/^\/+|\/+$/g, "");

		// Remove any protocols (e.g., "http://", "https://")
		url = url.replace(/^(https?:\/\/)?/i, "");

		// Remove any parts after the slash (/)
		const slashIndex = url.indexOf("/");
		if (slashIndex !== -1) {
			url = url.substr(0, slashIndex);
		}

		return url;
	});
}

const themeSwapper = require("tailwindcss-theme-swapper");
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
export const content = [
	"./app/**/*.{js,ts,jsx,tsx}",
	"./pages/**/*.{js,ts,jsx,tsx}",
	"./components/**/*.{js,ts,jsx,tsx}",
	"./lib/**/*.{js,ts,jsx,tsx}",
];

export const darkMode = "class";

const light = {
	colors: {
		//white: "#FFFFFF",
		backdrop: {
			DEFAULT: "white",
			200: "#e5e7eb",
		},
		gray: {
			200: "#e5e7eb",
			300: "#d1d5db",
			700: "#374151",
			800: "#1f2937",
		},
		blue: {
			500: "#3b82f6",
		},
	},
};

const dark = {
	colors: {
		//white: "#00000",
		backdrop: {
			DEFAULT: "black",
			200: "#18181b",
		},
		gray: {
			200: "#1C1C1F",
			300: "#27272a",
			700: "#d1d5db",
			800: "#e4e4e7",
		},
		blue: {
			500: "#1e40af",
		},
	},
};

const themes = {
	themes: [
		{
			name: "base",
			selectors: [":root"],
			theme: light,
		},
		{
			name: "dark",
			selectors: [".dark"],
			theme: dark,
		},
	],
};

// :is(.dark .dark\:hover\:bg-neutral-950:hover)

const variants = plugin(({ addVariant, matchVariant }) => {
	addVariant("compact", ":is(.compact &)");
	//addVariant("darkmode", "@media(prefers-color-scheme:dark){:is(.system &)}{:is(.dark &)}",);
});

export const plugins = [
	require("@tailwindcss/typography"),
	require("@tailwindcss/forms"),
	require("@tailwindcss/container-queries"),
	themeSwapper(themes),
	variants,
];

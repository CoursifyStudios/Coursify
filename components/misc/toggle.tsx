import { Switch } from "@headlessui/react";

export function Toggle({
	enabled,
	setEnabled,
}: {
	enabled: boolean;
	setEnabled: (value: boolean) => void;
}) {
	return (
		<>
			<Switch
				checked={enabled}
				onChange={setEnabled}
				className={`${
					enabled ? "bg-blue-500 dark:bg-blue-800" : "bg-gray-200"
				} relative inline-flex h-6 w-11 items-center rounded-full transition`}
			>
				<span className="sr-only">Enable this feature</span>

				<span
					className={`${
						enabled ? "translate-x-6" : "translate-x-1"
					} inline-block h-4 w-4 rounded-full bg-white transition`}
				/>
			</Switch>
		</>
	);
}

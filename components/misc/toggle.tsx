import { Switch } from "@headlessui/react";
import { Dispatch, SetStateAction } from "react";

export function Toggle({
	enabled,
	setEnabled,
}: {
	enabled: boolean;
	setEnabled: Dispatch<SetStateAction<boolean>>;
}) {
	return (
		<Switch
			checked={enabled}
			onChange={setEnabled}
			className={`${
				enabled ? "bg-blue-500" : "bg-gray-200"
			} relative inline-flex h-6 w-11 items-center rounded-full transition`}
		>
			<span className="sr-only">Enable this feature</span>
			<span
				className={`${
					enabled ? "translate-x-6" : "translate-x-1"
				} inline-block h-4 w-4 transform rounded-full bg-white transition`}
			/>
		</Switch>
	);
}

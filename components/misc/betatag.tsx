import { BeakerIcon } from "@heroicons/react/24/outline";

export default function Betatag() {
	return (
		<div className="inline-flex shrink-0 select-none rounded-full bg-green-300 px-2.5 py-0.5 text-sm font-semibold">
			<BeakerIcon className="h-5 w-5 text-green-700" />
			<p className="ml-1 text-green-700">Beta Feature</p>
		</div>
	);
}

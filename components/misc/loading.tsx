import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function Loading({ className }: { className: string }) {
	return (
		<div
			className={`flex items-center rounded-lg bg-gray-200 px-2 py-0.5 font-medium text-gray-700 ${className}`}
		>
			<ArrowPathIcon className="mr-2 h-5 w-5 animate-spin" /> Loading...
		</div>
	);
}

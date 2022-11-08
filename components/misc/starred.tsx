import { StarIcon as StarIconHollow } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";

export default function Starred(props: { starred: boolean }) {
	return props.starred ? (
		<StarIcon className="h-6 w-6 text-yellow-400" />
	) : (
		<StarIconHollow className="h-6 w-6 text-gray-800" />
	);
}

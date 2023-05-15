import { BeakerIcon } from "@heroicons/react/24/outline";
import { ColoredPill } from "./pill";

export default function Betatag() {
	return (
		<ColoredPill color="green">
			<BeakerIcon className="h-5 w-5" />
			<p className="ml-1">Beta</p>
		</ColoredPill>
	);
}

import { BeakerIcon } from "@heroicons/react/24/outline";
import { ColoredPill } from "./pill";

export default function Betatag() {
	return (
		<ColoredPill color="green">
			<BeakerIcon className="w-full h-5 w-5" />
			<p className="w-full ml-1">Beta</p>
		</ColoredPill>
	);
}

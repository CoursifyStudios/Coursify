import { NextPage } from "next";
import { Toggle } from "../../misc/toggle";
import { useSettings } from "../../../lib/stores/settings";

const Theming: NextPage<{}> = () => {
	const { data, set } = useSettings();

	return (
		<>
			<h3 className="title-sm mb-6">Color</h3>
			<div className="flex grow justify-between">
				<div>
					<h4 className="font-medium">Color Mode</h4>
					<p className="text-sm text-gray-700">
						Change between dark and light mode.
					</p>
				</div>
				<Toggle
					enabled={data.theme == "dark"}
					setEnabled={() =>
						set({
							theme: data.theme == "light" ? "dark" : "light",
						})
					}
				/>
			</div>
		</>
	);
};

export default Theming;

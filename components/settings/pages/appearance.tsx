import { NextPage } from "next";
import { Toggle } from "../../misc/toggle";
import { useSettings } from "../../../lib/stores/settings";
import { Header } from "../components/header";

const Theming: NextPage<{}> = () => {
	const { data, set } = useSettings();

	return (
		<>
			<Header name="color" page={1}>
				Color
			</Header>
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
			<div className="mb-[100rem]"></div>
			<Header name="testong" page={1}>
				Testong
			</Header>
		</>
	);
};

export default Theming;

import { NextPage } from "next";
import { Toggle } from "../../misc/toggle";
import { useSettings } from "../../../lib/stores/settings";
import { Header } from "../components/header";
import { ToggleSection } from "../components/sections";

const Theming: NextPage<{}> = () => {
	const { data, set } = useSettings();

	return (
		<>
			<Header name="color" page={1}>
				Color
			</Header>
			<ToggleSection
				name="Color Mode"
				description="Change between dark and light mode."
				enabled={data.theme == "dark"}
				setEnabled={() =>
					set({
						theme: data.theme == "light" ? "dark" : "light",
					})
				}
			/>

			<Header name="layout" page={1}>
				Layout Settings
			</Header>
			<ToggleSection
				name="Compact Mode"
				beta={true}
				description="Compacts down element in order to have more room on the screen. Recommended for power users."
				enabled={data.compact}
				setEnabled={() =>
					set({
						compact: !data.compact,
					})
				}
			/>
		</>
	);
};

export default Theming;

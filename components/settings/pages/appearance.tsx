import { NextPage } from "next";
import { useSettings } from "../../../lib/stores/settings";
import { Header } from "../components/header";
import { ToggleSection, DropdownSection } from "../components/sections";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { Database, Json } from "../../../lib/db/database.types";

const Theming: NextPage<{}> = () => {
	const user = useUser();
	const supabase = useSupabaseClient<Database>();
	const { data, set, loadSettings } = useSettings();

	const types: { id: string; name: string }[] = [
		{
			id: "system",
			name: "System Default",
		},
		{
			id: "light",
			name: "Light Mode",
		},
		{
			id: "dark",
			name: "Dark Mode",
		},
	];

	return (
		<>
			<Header name="color" page={1}>
				Color
			</Header>
			<DropdownSection
				name="Color Mode"
				description="Change between dark and light mode."
				currentValue={types.find((t) => t.id == data.theme)!}
				values={types}
				onChange={(value) => {
					set({
						theme: value.id as "dark" | "light" | "system",
					});
				}}
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

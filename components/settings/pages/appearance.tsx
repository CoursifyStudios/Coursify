import { NextPage } from "next";
import { useSettings } from "../../../lib/stores/settings";
import { Header } from "../components/header";
import { ToggleSection } from "../components/sections";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { Database, Json } from "../../../lib/db/database.types";

const Theming: NextPage<{}> = () => {
	const user = useUser();
	const supabase = useSupabaseClient<Database>();
	const { data, set } = useSettings();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (loading) return;
		if (user == undefined || user.id == undefined) return;
		setLoading(true);
		useSettings.getState().loadSettings(supabase, user.id);
		useSettings.subscribe(async (state) => {
			await supabase.from("settings").upsert({
				user_id: user.id,
				settings: state.data as unknown as Json,
			}).eq("user_id", user.id);
		})
	}, [loading, supabase, user])

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

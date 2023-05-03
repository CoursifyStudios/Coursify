import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useSettings } from "../lib/stores/settings";
import { Toggle } from "../components/misc/toggle";

const Settings: NextPage = () => {
	const { data, set } = useSettings();

	return (
		<div>
			Setteronies: Theme: {data.theme}{" "}
			<Toggle
				enabled={data.theme == "dark"}
				setEnabled={() =>
					set({
						theme: data.theme == "light" ? "dark" : "light",
					})
				}
			/>
		</div>
	);
};

export default Settings;

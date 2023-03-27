import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { NextPage } from "next";
import { useEffect, useState } from "react";

const Settings: NextPage = () => {
	const supabase = useSupabaseClient();
	const [data, setData] = useState();
	//const user = useUser();
	useEffect(() => {
		(async () => {
			// if (user) {
			// 	const { data, error } = await supabaseClient.rpc(
			// 		"get_profile_classes",
			// 		{ id: "746abfff-e526-41d8-8bd0-ed420fe4f244" }
			// 	);
			// 	console.log(error, data);
			// }
			const { data, error } = await supabase
				.from("groups")
				.select(
					`
				*, 
				announcements (
					*, users (
						avatar_url, full_name 
					)
				),
				users (
					*
				)
				`
				)
				.eq("id", "cfca7d36-2f81-4aa2-af91-4b3d2fefcb63");
			console.log(data, error);
		})();
	}, [supabase]);
	return <div>testing page atm</div>;
};

export default Settings;

import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { NextPage } from "next";
import { useEffect, useState } from "react";

const Settings: NextPage = () => {
	const supabaseClient = useSupabaseClient();
	const [data, setData] = useState();
	const user = useUser();
	useEffect(() => {
		(async () => {
			if (user) {
				const { data, error } = await supabaseClient.rpc(
					"get_profile_classes",
					{ id: "746abfff-e526-41d8-8bd0-ed420fe4f244" }
				);
				console.log(error, data);
			}
		})();
	}, [supabaseClient, user]);
	return <div>testing page atm</div>;
};

export default Settings;

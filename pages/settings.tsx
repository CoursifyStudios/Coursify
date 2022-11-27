import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { NextPage } from "next";
import { useEffect, useState } from "react";

const Settings: NextPage = () => {
	const supabaseClient = useSupabaseClient();
	const [data, setData] = useState();
	useEffect(() => {
		(async () => {
			//const { data, error } = await supabaseClient.rpc('create_assignment', {name: "testing", description: "don't mind me just testing if functions work", class_id: "4db31720-9711-4860-b37d-e15bc7bf74e3"});
			//console.log(error, data)
		})();
	}, [supabaseClient]);
	return <div>testing page atm</div>;
};

export default Settings;

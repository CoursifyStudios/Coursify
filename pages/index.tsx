import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";

export default function Home() {
	const supabaseClient = useSupabaseClient();
	const user = useUser();
	const [data, setData] = useState();

	useEffect(() => {
		async function loadData() {
			const { data } = await supabaseClient
				.from("test")
				.select("*")
				.limit(1)
				.single();
			setData(data);
		}
		loadData();
		// Only run query once user is logged in.
		//if (user) loadData()
	}, [user]);
	if (!data) {
		return <div>loading</div>;
	}
	return <div>{JSON.stringify(data)}</div>;
}

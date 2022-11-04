import { Suspense } from "react";
import { createSupabaseClient } from "../lib/supabase";

// export default async function Home() {
// 	const data = await getData();

// 	return <div>logged in, data {JSON.stringify(data, null, 2)}</div>;
// }

// async function getData() {
// 	const supabase = createSupabaseClient();
// 	const { data } = await supabase.from("test").select("*").limit(1).single();
// 	//console.log(data);
// 	return data;
// }

export default async function Profile() {
	const user = await getData();

	return <div>Hello {user?.user.email}</div>;
}

async function getData() {
	const supabase = createSupabaseClient();

	const {
		data: { session },
	} = await supabase.auth.getSession();

	return session;
}

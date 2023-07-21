import Betatag from "@/components/misc/betatag";
import { Database } from "@/lib/db/database.types";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { NextPage } from "next";
import { useState, useEffect } from "react";

const Admin: NextPage = () => {
	const user = useUser();
	const supabase = useSupabaseClient<Database>();
	const [schools, setSchools] = useState<
		{
			id: string;
			name: string;
		}[]
	>([]);

	useEffect(() => {
		if (user?.id == undefined) return;
		if (supabase == undefined) return;
		(async () => {
			const { data } = await supabase
				.from("enrolled")
				.select("schools ( name, id )")
				.eq("user_id", user?.id)
				.eq("adminBool", true);

			if (data == null) return;

			setSchools(
				data
					.filter((s) => s.schools != null)
					.map((school) => ({
						id: school.schools!.id,
						name: school.schools!.name,
					}))
			);

			// setSchools(new Array(20).fill({
			// 	id: "Baller",
			// 	name: "Welcome to team fortress 2, after 9 years in development, hopefully it will have been worth the wait. Thanks and have fun"
			// }))
		})();
	}, [user, supabase]);

	return (
		<div className="mx-auto my-10 flex w-full max-w-screen-xl flex-col px-4">
			<h1>Admin</h1>
			<h2>Please choose a school</h2>
			<div className="grid md:grid-cols-2 xl:grid-cols-3">
				{schools.map((school, id) => (
					<>
						<a key={id} href={`/admin/${school.id}`}>
							{school.name}
						</a>
					</>
				))}
			</div>
			<div className="flex items-center mx-auto text-sm text-gray-500 mt-10">
				<p className="mr-2">Coursify Admin Dashboard</p>
				<Betatag />
			</div>
		</div>
	);
};

export default Admin;

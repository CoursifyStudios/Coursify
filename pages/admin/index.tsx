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
		})();
	}, [user, supabase]);

	return (
		<div>
			pick school
			<div className="grid md:grid-cols-2 xl:grid-cols-3">
				{schools.map((school, id) => (
					<>
						<a key={id} href={`/admin/${school.id}`}>
							{school.name}
						</a>
					</>
				))}
			</div>
		</div>
	);
};

export default Admin;

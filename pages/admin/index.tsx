import Layout from "@/components/layout/layout";
import Betatag from "@/components/misc/betatag";
import { Database } from "@/lib/db/database.types";
import { BuildingOffice2Icon } from "@heroicons/react/24/outline";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { NextPage } from "next";
import { useState, useEffect, Fragment, ReactElement } from "react";
import { NextPageWithLayout } from "../_app";

const Admin: NextPageWithLayout = () => {
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
				.eq("admin_bool", true);

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
		<div className="mx-auto mt-10 flex w-full max-w-screen-xl flex-col px-4 grow">
			<h1 className="title">Admin Dashboard</h1>
			<h2 className="mt-4 font-medium mb-2 text-lg">
				Please choose a school to login to:
			</h2>
			<div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 font-medium">
				{schools.length > 0 ? (
					schools.map((school, id) => (
						<Fragment key={id}>
							<a
								key={id}
								href={`/admin/${school.id}`}
								className="flex rounded-xl bg-backdrop-200 brightness-hover p-4 items-center"
							>
								<BuildingOffice2Icon className="mr-2 min-w-[1.25rem] h-5 text-gray-500" />
								<p className="truncate">{school.name}</p>
							</a>
						</Fragment>
					))
				) : (
					<>
						{[
							"Is that gabe?",
							"Cmon not every",
							"dude with a beard is",
							"Hi this is gabe",
							"noway.mp3",
							"other way caused a hydra",
							"tion error :sobbing_",
							"face: :sad: :f:",
						].map((t, i) => (
							<div
								className="bg-backdrop-200 rounded-xl animate-pulse p-4 flex items-center"
								key={i}
							>
								<BuildingOffice2Icon className="mr-2 min-w-[1.25rem] h-5 text-transparent bg-gray-300 rounded" />
								<p className="truncate text-transparent bg-gray-300 rounded">
									{t}
								</p>
							</div>
						))}
					</>
				)}
			</div>
			<div className="flex items-center mx-auto text-sm text-gray-500 mt-auto pt-10">
				<p className="mr-2">Coursify Admin Dashboard</p>
				<Betatag />
			</div>
		</div>
	);
};

export default Admin;

Admin.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

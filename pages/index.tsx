import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useBearStore, useTabs } from "../lib/tabs/handleTabs";
import { Database } from "../lib/db/database.types";
import { AllClassData, loadData } from "../lib/db/classes";
import { Class } from "../components/classes/class";
import Loading from "../components/misc/loading";

export default function Home() {
	const { newTab, tabs } = useTabs();
	const supabaseClient = useSupabaseClient<Database>();
	const user = useUser();
	const [data, setData] = useState<AllClassData>();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			if (user) {
				const data = await loadData(supabaseClient);
				setData(data);
				setLoading(false);
				sessionStorage.setItem("classes", JSON.stringify(data));
			}
		})();

		if (user && sessionStorage.getItem("classes")) {
			setData(JSON.parse(sessionStorage.getItem("classes") as string));
		}
		// Only run query once user is logged in.
		//if (user) loadData()
	}, [user, supabaseClient]);
	if (!user) {
		return null;
	}

	return (
		<>
			<div className="mx-auto mt-4 flex ">
				<div
					className="cursor-pointer rounded-md bg-gray-200 px-4 py-2 font-medium"
					onClick={() => supabaseClient.auth.signOut()}
				>
					Logout
				</div>
				<Link href="/settings" onClick={() => newTab("/settings")}>
					<div className="ml-2 rounded-md bg-gray-200 px-4 py-2 font-medium">
						Settings
					</div>
				</Link>
				<Link href="/tabstest" onClick={() => newTab("/tabstest")}>
					<div className="ml-2 rounded-md bg-gray-200 px-4 py-2 font-medium">
						Testing Tab
					</div>
				</Link>
			</div>

			<div className="my-10 mx-auto flex w-full max-w-screen-xl flex-col items-start space-y-5 break-words">
				<div className="flex w-full">
					<section>
						<div className="flex items-center">
							<h2 className="text-2xl font-bold">Classes</h2>
							{loading && <Loading className="ml-4" />}
						</div>
						<div className="mt-6 grid grid-cols-3 gap-10">
							{data &&
								data.data &&
								typeof data.data != "undefined" &&
								data.data.map((v, i) => (
									<Link
										href={"/classes/" + v.id}
										onClick={() => "/classes/" + v.id}
										key={i}
									>
										<Class class={{ data: v }} key={i} />
									</Link>
								))}
						</div>
					</section>
					<section className="flex-1">
						<h2 className="text-2xl font-bold">Daily Schedule</h2>
						<div className="mt-6 flex flex-col">
							<div className=" rounded-xl bg-gray-200 p-4">Schedule here</div>
						</div>
					</section>
				</div>
			</div>
		</>
	);
}

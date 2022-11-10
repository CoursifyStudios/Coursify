import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useBearStore, useTabs } from "../lib/tabs/handleTabs";
import { Database } from "../lib/db/database.types";
import { classData, loadData } from "../lib/db/classes";

export default function Home() {
	const { newTab, tabs } = useTabs();
	const supabaseClient = useSupabaseClient<Database>();
	const user = useUser();
	const [data, setData] = useState<classData>();

	useEffect(() => {
		(async () => {
			if (user) {
				const data = await loadData(supabaseClient);
				setData(data);
			}
		})();
		// Only run query once user is logged in.
		//if (user) loadData()
	}, [user, supabaseClient]);
	if (!user) {
		return (
			<div className="flex flex-col ">
				<div className="my-10 mx-auto flex max-w-screen-xl flex-col items-start space-y-5 break-words">
					<Link href="/login">
						<div className="rounded-md bg-gray-200 px-4 py-2 font-medium  ">
							To login page
						</div>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="my-10 mx-auto flex max-w-screen-xl flex-col items-start space-y-5 break-words">
			<div className="max-w-lg">
				<h2 className="text-lg font-medium ">Classes</h2>
				{JSON.stringify(data)}
			</div>
			{data ? (
				<div className="flex flex-col items-start">
					<h2 className="text-lg font-medium">Account</h2>
					<p className="max-w-xl ">{user.user_metadata.name}</p>
					<div className="mt-4 flex ">
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
				</div>
			) : (
				<div>loading...</div>
			)}
		</div>
	);
}

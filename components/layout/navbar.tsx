import { useUser } from "@supabase/auth-helpers-react";
import type { ReactNode } from "react";

export default function Navbar() {
	const user = useUser();
	const tabs: Tab[] = [
		{
			name: "Home",
			selected: true,
		},
		{
			name: "Assignments",
			selected: false,
		},
	];

	return (
		<nav className="flex items-center justify-between bg-gray-200 px-8 py-2.5">
			<div className="flex items-center space-x-6">
				{tabs.map((v, i) => (
					<>
						<div
							key={i}
							className={`my-0.5  rounded-md ${
								v.selected ? "bg-gray-50 shadow-md" : "bg-gray-300"
							} px-3 py-0.5 text-lg font-semibold `}
						>
							{v.name}
						</div>

						{i == 1 && (
							<div className="graydient h-10 w-[0.07rem]" key={-1}></div>
						)}
					</>
				))}
			</div>
			<div className="flex flex-row-reverse space-x-6">
				{user ? (
					<img
						src={user.user_metadata.picture}
						className="h-9 rounded-full shadow-md shadow-black/25"
					/>
				) : (
					<div className="bg-blue-500 px-4 py-1 font-medium text-white">
						Login
					</div>
				)}
			</div>
		</nav>
	);
}

interface Tab {
	//this is temp, see the tabs rfc here for the proposal: https://docs.google.com/document/d/1oAc1VBBhF7aVSQeesqvNN4Wb8J4m-aJBoMPG1vLyVZs/edit
	name: string;
	selected: boolean;
}

function button(props: { icon: ReactNode; classes: string }) {}

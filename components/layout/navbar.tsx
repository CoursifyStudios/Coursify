export default function Navbar() {
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
		<nav className="flex justify-between bg-gray-200 px-8 py-4">
			<div className="flex space-x-6">
				{tabs.map((v, i) => (
					<div
						key={i}
						className={`rounded-md  ${
							v.selected ? "bg-gray-50 shadow-md" : "bg-gray-300"
						} px-3 py-0.5 text-lg font-semibold`}
					>
						{v.name}
					</div>
				))}
			</div>
		</nav>
	);
}

interface Tab {
	//this is temp, see the tabs rfc here for the proposal: https://docs.google.com/document/d/1oAc1VBBhF7aVSQeesqvNN4Wb8J4m-aJBoMPG1vLyVZs/edit
	name: string;
	selected: boolean;
}

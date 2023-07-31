import { useState, Fragment } from "react";

const colors = [
	{ id: 1, name: "blue" },
	{ id: 2, name: "green" },
	{ id: 3, name: "purple" },
	{ id: 4, name: "red" },
	{ id: 5, name: "yellow" },
	{ id: 6, name: "orange" },
	{ id: 7, name: "gray" },
];

export default function ColorPicker() {
	const [selectedColor, setSelectedColor] = useState(colors[0]);

	return (
		<>
			<div className="flex flex-col bg-backdrop-200 h-fill p-5">
				<div className="flex flex-row">
					<span>Selected color: </span>
					<div className={`h-5 w-5 bg-${selectedColor.name}-200`} />
				</div>

				<div className="grid gap-3 grid-cols-3 w-20">
					{colors.map((color, i) => (
						<Fragment key={i}>
							<div
								className={`h-5 w-5 bg-${color.name}-200 rounded-full ${
									color.id == selectedColor.id ? "border-black border" : ""
								}`}
								onClick={() => setSelectedColor(color)}
							/>
						</Fragment>
					))}
				</div>
			</div>
		</>
	);
}

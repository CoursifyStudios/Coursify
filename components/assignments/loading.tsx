import { ColoredPill } from "../misc/pill";

export const Loading = () => {
	return (
		<div className="w-full  flex grow flex-col">
			<ColoredPill color="gray" className="w-full mr-auto animate-pulse">
				<span className="w-full invisible">trojker</span>
			</ColoredPill>
			<div className="w-full mt-4 w-full max-w-lg rounded-xl bg-gray-200 p-4 xl:max-w-xl">
				<h1 className="w-full title mb-2 line-clamp-2 w-max rounded-md bg-gray-300">
					{/* This causes a memory leak, Too bad! - Lukas */}
					<span className="w-full invisible">My wife left me for kids</span>
				</h1>
				<p className="w-full mt-4 line-clamp-2 w-max rounded-md bg-gray-300">
					<span className="w-full invisible">
						{/* We do some mild trolling - Bloxs */}
						Lorem ipsum I need to file divorce papers now
					</span>
				</p>
			</div>
			<div className="w-full mt-6 flex grow">
				<div className="w-full mt-4 w-full max-w-lg rounded-xl bg-gray-200 p-4 xl:max-w-xl"></div>
				<div className="w-full ml-4 mt-4 max-h-48 grow rounded-xl bg-gray-200 p-4 xl:max-w-xl"></div>
			</div>
		</div>
	);
};

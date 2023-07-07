import { ColoredPill } from "../misc/pill";

export const Loading = () => {
	return (
		<div className=" flex grow flex-col">
			<ColoredPill color="gray" className="mr-auto animate-pulse">
				<span className="invisible">trojker</span>
			</ColoredPill>
			<div className="mt-4 w-full max-w-lg rounded-xl bg-gray-200 p-4 xl:max-w-xl">
				<h1 className="title mb-2 line-clamp-2 w-max rounded-md bg-gray-300">
					{/* This causes a memory leak, Too bad! - Lukas */}
					<span className="invisible">My wife left me for kids</span>
				</h1>
				<p className="mt-4 line-clamp-2 w-max rounded-md bg-gray-300">
					<span className="invisible">
						{/* We do some mild trolling - Bloxs */}
						Lorem ipsum I need to file divorce papers now
					</span>
				</p>
			</div>
			<div className="mt-6 flex grow">
				<div className="mt-4 w-full max-w-lg rounded-xl bg-gray-200 p-4 xl:max-w-xl"></div>
				<div className="ml-4 mt-4 max-h-48 grow rounded-xl bg-gray-200 p-4 xl:max-w-xl"></div>
			</div>
		</div>
	);
};

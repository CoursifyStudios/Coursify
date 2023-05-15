import { ColoredPill } from "../misc/pill";

export const LoadingStudentClass = ({ className }: { className: string }) => {
	return (
		<div
			className={`flex h-48 w-[19rem] animate-pulse flex-col rounded-xl bg-backdrop-200 ${className}`}
		>
			<div className="h-32 rounded-t-xl bg-gray-200"></div>
			<div className="p-4">
				<div className="flex items-start justify-between">
					<h3 className="line-clamp-2 break-words rounded-md bg-gray-200 text-xl font-semibold">
						<span className="invisible">:trojker: emoji</span>
					</h3>
					<ColoredPill color={"gray"} className={"h-5 w-20 animate-pulse"}>
						{" "}
					</ColoredPill>
				</div>
			</div>
		</div>
	);
};

export const LoadingTeacherClass = ({ className }: { className: string }) => {
	return (
		<div
			className={`flex h-48 w-[19rem] animate-pulse rounded-xl bg-gray-200 ${className}`}
		></div>
	);
};

import { Info } from "@/components/tooltips/info";
import { AssignmentTypes } from "@/lib/db/assignments/assignments";
import {
	CheckCircleIcon,
	ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, useLayoutEffect } from "react";
import { submissionType } from "../../submissionType";
import { AssignmentAll } from "../settings.types";

const All = ({
	imports: { settings, setSettings },
}: {
	imports: {
		settings: AssignmentAll;
		setSettings: Dispatch<SetStateAction<AssignmentAll>>;
	};
}) => {
	useLayoutEffect(() => {
		if (settings == undefined || settings.assignmentType != AssignmentTypes.ALL)
			setSettings({
				// Defaults
				assignmentType: AssignmentTypes.ALL,
				allowedTypes: [
					AssignmentTypes.LINK,
					AssignmentTypes.GOOGLE,
					AssignmentTypes.MEDIA,
					AssignmentTypes.TEXT,
					AssignmentTypes.MEDIA,
					AssignmentTypes.FILE_UPLOAD,
				],
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (settings == undefined || settings.assignmentType != AssignmentTypes.ALL)
		return null;

	const assignmentTypes = [
		AssignmentTypes.LINK,
		AssignmentTypes.GOOGLE,
		AssignmentTypes.MEDIA,
		AssignmentTypes.TEXT,
		AssignmentTypes.FILE_UPLOAD,
	];

	return (
		<>
			<div className="w-full flex items-center rounded-xl bg-yellow-500/10 p-3">
				<div className="w-full mr-3">
					<ExclamationCircleIcon className="w-full h-6 w-6 text-yellow-500" />
				</div>
				<p className="w-full text-sm">
					Coursify recommends choosing a different assignment type so that
					assignments can be better prioritized for your stuents
				</p>
			</div>
			<label htmlFor="minFiles" className="w-full flex grow flex-col">
				<span className="w-full flex text-sm font-medium">
					Submission Types Allowed<span className="w-full text-red-600">*</span>
					<Info className="w-full ml-2">
						Specify certain types of submissions that can be submitted by
						students to this assignment. By default, all types of submissions
						can be submitted.
					</Info>
				</span>
				<div className="w-full mt-4 grid grid-cols-3 gap-3">
					{submissionType
						.filter((s) => assignmentTypes.includes(s.type))
						.map((type) => (
							<div
								key={type.type}
								className={`brightness-hover h-full cursor-pointer rounded-md p-4 ${
									//@ts-expect-error
									settings.allowedTypes!.includes(type.type)
										? "brightness-focus"
										: "bg-backdrop-200"
								} `}
								onClick={() =>
									//@ts-expect-error
									setSettings((settings) => {
										//@ts-expect-error
										if (settings.allowedTypes.includes(type.type)) {
											return {
												...settings,
												allowedTypes: settings.allowedTypes.filter(
													(a) => type.type != a
												),
											};
										} else {
											return {
												...settings,
												allowedTypes: [...settings.allowedTypes, type.type],
											};
										}
									})
								}
							>
								<div className="w-full flex items-center">
									<div className="w-full rounded-full bg-blue-500 p-2 text-white">
										{type.icon}
									</div>
									<div className="w-full ml-3">
										<h1 className="w-full font-semibold">{type.name}</h1>
									</div>
									{/* @ts-expect-error */}
									{settings.allowedTypes!.includes(type.type) && (
										<CheckCircleIcon className="w-full ml-auto h-6 w-6 text-gray-700" />
									)}
								</div>
							</div>
						))}
				</div>
			</label>
		</>
	);
};

export default All;

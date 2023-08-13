import { Dispatch, SetStateAction, useLayoutEffect } from "react";
import { AssignmentTypes } from "../../../../../lib/db/assignments/assignments";
import { Info } from "../../../../tooltips/info";
import { AssignmentGoogle, GoogleSubmissionTypes } from "../settings.types";

const All = ({
	imports: { settings, setSettings },
}: {
	imports: {
		settings: AssignmentGoogle;
		setSettings: Dispatch<SetStateAction<AssignmentGoogle>>;
	};
}) => {
	useLayoutEffect(() => {
		if (
			settings == undefined ||
			settings.assignmentType != AssignmentTypes.GOOGLE
		)
			setSettings({
				// Defaults
				assignmentType: AssignmentTypes.GOOGLE,
				service: GoogleSubmissionTypes.DOCS,
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (
		settings == undefined ||
		settings.assignmentType != AssignmentTypes.GOOGLE
	)
		return null;

	return (
		<>
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
					{/* {GoogleSubmissionTypes.forEa
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
									setSettings((settings) => {
										//@ts-expect-error
										
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
									{/* @ts-expect-error 
									{settings.allowedTypes!.includes(type.type) && (
										<CheckCircleIcon className="w-full ml-auto h-6 w-6 text-gray-700" />
									)}
								</div>
							</div>
						))} */}
				</div>
			</label>
		</>
	);
};

export default All;

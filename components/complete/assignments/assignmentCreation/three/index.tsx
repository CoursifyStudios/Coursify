import { NextPage } from "next";
import { Dispatch, SetStateAction, useState } from "react";
import { useAssignmentStore } from "..";
import { Button } from "../../../../misc/button";
import { submissionType } from "../submissionType";
import GetAssignmentSettings from "./settings";
import { AssignmentSettingsTypes } from "./settings.types";

const AssignmentSettings: NextPage<{
	stage: number;
	setStage: Dispatch<SetStateAction<number>>;
}> = ({ setStage, stage }) => {
	const { data: assignmentData, set: setAssignmentData } = useAssignmentStore();
	const [settings, setSettings] = useState<AssignmentSettingsTypes>();

	if (stage != 3) return null;
	return (
		<>
			<h2 className="mb-10 mt-6 text-xl font-bold">
				{
					submissionType.find(
						(submission) => submission.type == assignmentData?.type
					)?.name
				}{" "}
				- Submission Settings
			</h2>
			{assignmentData && (
				<GetAssignmentSettings
					assignmentType={assignmentData.type}
					setSettings={setSettings}
					settings={settings}
				/>
			)}
			<div className="mt-10 flex flex-col space-y-3 ">
				<div className="ml-auto flex space-x-4">
					<span onClick={() => setStage((stage) => stage - 1)}>
						<Button>Prev</Button>
					</span>

					<span onClick={() => setStage((stage) => stage + 1)}>
						<Button color="bg-blue-500" className="text-white">
							Next
						</Button>
					</span>
				</div>
			</div>
		</>
	);
};

export default AssignmentSettings;

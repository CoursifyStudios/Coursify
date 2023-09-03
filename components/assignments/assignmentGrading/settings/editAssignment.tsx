import { Popup } from "@/components/misc/popup";
import { Tab } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction } from "react";
import AssignmentSettings from "../../assignmentCreation/three";
import { TeacherAssignmentResponse } from "@/lib/db/assignments/assignments";
import { AssignmentSettingsTypes } from "../../assignmentCreation/three/settings.types";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database, Json } from "@/lib/db/database.types";
import AssignmentDetails, {
	AssignmentSaveData,
} from "../../assignmentCreation/two";

const EditAssignment = ({
	close,
	open,
	assignment,
	setAssignment,
	supabase,
	setLoading,
	setError,
}: {
	open: boolean;
	close: () => void;
	assignment: TeacherAssignmentResponse;
	setAssignment: Dispatch<SetStateAction<TeacherAssignmentResponse>>;
	supabase: SupabaseClient<Database>;
	setLoading: Dispatch<SetStateAction<boolean>>;
	setError: Dispatch<SetStateAction<string>>;
}) => {
	const editSettings = async (settings: AssignmentSettingsTypes) => {
		if (JSON.stringify(assignment.data?.settings) == JSON.stringify(settings)) {
			close();
			return;
		}
		setLoading(true);
		setError("");
		const { error } = await supabase
			.from("assignments")
			.update({ settings: settings as unknown as Json })
			.eq("id", assignment.data?.id);

		if (error) {
			setError(error.message);
		} else {
			setAssignment((a) => {
				if (!a.data) return a;
				return {
					...a,
					data: {
						...a.data,
						settings: settings as unknown as Json,
					},
				};
			});
		}
		close();
		setLoading(false);
	};

	const editAssignment = async (assign: AssignmentSaveData) => {
		let updatedDetails = false;
		const {
			submissionInstructions: _,
			content: c,
			...scopedAssignment
		} = assign;

		// try to reduce the vast majority of the data transfer since the lexical json is massive
		if (JSON.stringify(c) != JSON.stringify(assignment.data?.content)) {
			updatedDetails = true;
		}
		setLoading(true);
		setError("");
		const { error } = await supabase
			.from("assignments")
			.update({
				...scopedAssignment,
				submission_instructions: assign.submissionInstructions || null,
				...(updatedDetails ? { content: c } : {}),
			})
			.eq("id", assignment.data?.id);

		if (error) {
			setError(error.message);
		} else {
			setAssignment((a) => {
				if (!a.data) return a;
				return {
					...a,
					data: {
						...a.data,
						...scopedAssignment,
						submission_instructions: assign.submissionInstructions || null,
						content: c,
					},
				};
			});
		}
		close();
		setLoading(false);
	};

	return (
		<Popup open={open} closeMenu={close}>
			<Tab.Group as="div" className="flex grow flex-col">
				<Tab.List as="div" className=" mb-4 flex max-sm:space-x-2 sm:space-x-6">
					<Tab as={Fragment}>
						{({ selected }) => (
							<div
								tabIndex={0}
								className={`flex cursor-pointer items-center rounded-lg border px-2.5  focus:outline-none ${
									selected
										? "brightness-focus"
										: "border-transparent bg-gray-200"
								} text-lg font-semibold`}
							>
								Assignment Details
							</div>
						)}
					</Tab>
					<Tab as={Fragment}>
						{({ selected }) => (
							<div
								tabIndex={0}
								className={`flex cursor-pointer items-center rounded-lg border px-2.5  focus:outline-none ${
									selected
										? "brightness-focus"
										: "border-transparent bg-gray-200"
								} text-lg font-semibold`}
							>
								Submission Settings
							</div>
						)}
					</Tab>
				</Tab.List>
				<Tab.Panels>
					<Tab.Panel>
						<AssignmentDetails
							stage={2}
							customAssignment={assignment.data}
							save={editAssignment}
						/>
					</Tab.Panel>
					<Tab.Panel>
						<AssignmentSettings
							stage={3}
							useCustomSettings={true}
							save={editSettings}
							customSettings={
								assignment.data?.settings as unknown as AssignmentSettingsTypes
							}
							assignmentType={assignment.data?.type}
						/>
					</Tab.Panel>
				</Tab.Panels>
			</Tab.Group>
		</Popup>
	);
};

export default EditAssignment;

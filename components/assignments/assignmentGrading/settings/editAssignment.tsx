import { Popup } from "@/components/misc/popup";
import { Tab } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction } from "react";
import AssignmentSettings from "../../assignmentCreation/three";
import { TeacherAssignmentResponse } from "@/lib/db/assignments/assignments";
import { AssignmentSettingsTypes } from "../../assignmentCreation/three/settings.types";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database, Json } from "@/lib/db/database.types";

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
			close();
		}
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
								Basics
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
								} text-lg font-semibold `}
							>
								Settings
							</div>
						)}
					</Tab>
				</Tab.List>
				<Tab.Panels>
					<Tab.Panel>srstggresd</Tab.Panel>
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

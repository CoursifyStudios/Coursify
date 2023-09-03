import { Popup } from "@/components/misc/popup";
import { Tab } from "@headlessui/react";
import { Fragment } from "react";
import AssignmentSettings from "../../assignmentCreation/three";
import { TeacherAssignmentResponse } from "@/lib/db/assignments/assignments";
import { AssignmentSettingsTypes } from "../../assignmentCreation/three/settings.types";

const EditAssignment = ({
	close,
	open,
	assignment,
}: {
	open: boolean;
	close: () => void;
	assignment: TeacherAssignmentResponse;
}) => {
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
							save={() => {
								close();
							}}
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

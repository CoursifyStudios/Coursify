import Avatar from "@/components/misc/avatar";
import {
	TeacherAssignment,
	TeacherAssignmentResponse,
} from "@/lib/db/assignments/assignments";
import { Database } from "@/lib/db/database.types";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { SupabaseClient } from "@supabase/supabase-js";
import AssignmentHeader from "../assignmentPanel/header";
import { Dispatch, SetStateAction } from "react";
import { ColoredPill } from "@/components/misc/pill";

const AssignmentGradingUI = ({
	allAssignmentData,
	assignmentID,
	supabase,
	fullscreen,
	setFullscreen,
}: {
	supabase: SupabaseClient<Database>;
	allAssignmentData: TeacherAssignmentResponse;
	assignmentID: string;
	fullscreen: boolean;
	setFullscreen: Dispatch<SetStateAction<boolean>>;
}) => {
	const classData: TeacherAssignment = allAssignmentData.data!.classes!;

	const totalStudents = classData.users.filter(
		(user) => user.class_users[0].teacher == false
	).length;

	return (
		<div className="flex grow flex-col">
			<AssignmentHeader
				assignment={allAssignmentData}
				fullscreen={fullscreen}
				setFullscreen={setFullscreen}
			/>
			<div className="flex">
				<div className="flex w-64 my-2 mt-4 flex-col">
					<div className=" rounded-xl flex flex-col">
						<Disclosure defaultOpen>
							{({ open }) => (
								<>
									<Disclosure.Button className="flex rounded-lg items-center bg-gray-200 px-4 py-1.5 text-left text-sm font-medium">
										<span>Ungraded</span>
										<ColoredPill color="gray" className="ml-auto">
											1
										</ColoredPill>
										{/* <ChevronUpIcon
											className={`${
												open ? "rotate-180 transform" : ""
											} h-5 w-5 ml-auto`}
										/> */}
									</Disclosure.Button>
									<Disclosure.Panel className="px-4 pt-4 pb-2 text-sm"></Disclosure.Panel>
								</>
							)}
						</Disclosure>
						<Disclosure defaultOpen>
							{({ open }) => (
								<>
									<Disclosure.Button className="flex rounded-lg items-center bg-gray-200 px-4 py-1.5 text-left text-sm font-medium">
										<span>Not Submitted</span>
										<ColoredPill color="gray" className="ml-auto">
											1
										</ColoredPill>
										{/* <ChevronUpIcon
											className={`${
												open ? "rotate-180 transform" : ""
											} h-5 w-5 ml-auto`}
										/> */}
									</Disclosure.Button>
									<Disclosure.Panel className="px-4 pt-4 pb-2 text-sm"></Disclosure.Panel>
								</>
							)}
						</Disclosure>
						<Disclosure defaultOpen>
							{({ open }) => (
								<>
									<Disclosure.Button className="flex rounded-lg items-center bg-gray-200 px-4 py-1.5 text-left text-sm font-medium">
										<span>Graded</span>
										<ColoredPill color="gray" className="ml-auto">
											0/{totalStudents}
										</ColoredPill>
										{/* <ChevronUpIcon
											className={`${
												open ? "rotate-180 transform" : ""
											} h-5 w-5 ml-auto`}
										/> */}
									</Disclosure.Button>
									<Disclosure.Panel className="px-4 pt-4 pb-2 text-sm"></Disclosure.Panel>
								</>
							)}
						</Disclosure>
					</div>
				</div>
				<div className="flex grow justify-between bg-gray-200 h-32 m-4 p-2 rounded-xl">
					<div className="flex">
						<Avatar
							full_name="Jane Doe"
							avatar_url=""
							size="20"
							className="ml-4"
							text_size="xl"
						/>
						<div className="flex flex-col ml-3 justify-center">
							<h1 className="title">Jane Doe</h1>
							<p className="text-lg font-medium">0/10</p>
						</div>
					</div>
					<textarea
						placeholder="Enter a comment..."
						className=" w-72 resize-none !rounded-xl"
					/>
				</div>
			</div>
		</div>
	);
};

export default AssignmentGradingUI;

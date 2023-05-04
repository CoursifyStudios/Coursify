import { Transition, Dialog } from "@headlessui/react";
import {
	ChatBubbleBottomCenterTextIcon,
	ClipboardDocumentListIcon,
	DocumentCheckIcon,
	DocumentTextIcon,
	LinkIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { NextPage } from "next";
import { Dispatch, Fragment, ReactNode, SetStateAction, useState } from "react";

import { SerializedEditorState } from "lexical";
import Image from "next/image";
import {
	AssignmentTypes,
	NewAssignmentData,
} from "../../../lib/db/assignments";

import AssignmentCreation from "./three";
import { create } from "zustand";
import AssignmentDetails from "./two";
import { DueType } from "../assignments";
import { useSettings } from "../../../lib/stores/settings";

interface AssignmmentState {
	data: NewAssignmentData | undefined;
	set: (data: NewAssignmentData | undefined) => void;
}

export const useAssignmentStore = create<AssignmmentState>()((set) => ({
	data: undefined,
	set: (data) =>
		set((state) => ({
			data: data
				? ({ ...state.data, ...data } as NewAssignmentData)
				: undefined,
		})),
}));

export const CreateAssignment: NextPage<{
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	block: number;
	scheduleType: number;
	classid: string;
}> = ({ open, setOpen, block, scheduleType, classid }) => {
	const { data: settings } = useSettings();
	const [stage, setStage] = useState(1);
	const { setAssignmentData, assignmentData } = useAssignmentStore((state) => ({
		setAssignmentData: state.set,
		assignmentData: state.data,
	}));

	const closeMenu = () => {
		setOpen(false);
		setStage(1);
		setAssignmentData(undefined);
		setAssignmentData(undefined);
	};

	return (
		<Transition appear show={open} as={Fragment}>
			<Dialog open={open} onClose={closeMenu}>
				<Transition.Child
					enter="ease-out transition"
					enterFrom="opacity-75"
					enterTo="opacity-100 scale-100"
					leave="ease-in transition"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-75"
					as={Fragment}
				>
					<div
						className={`fixed inset-0 flex items-center justify-center bg-black/20 p-4 ${
							settings.theme == "dark" && "dark bg-black/40"
						}`}
					>
						<Transition.Child
							enter="ease-out transition"
							enterFrom="opacity-75 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in transition"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-75 scale-95"
							as={Fragment}
						>
							<Dialog.Panel className="relative flex w-full max-w-screen-md flex-col rounded-xl bg-white/75 p-4 shadow-md  backdrop-blur-xl dark:bg-neutral-950/75 dark:text-gray-100">
								<div className="flex items-center">
									<div className="z-10 grid h-8 w-8 place-items-center rounded-full bg-blue-500  font-semibold text-white">
										1
									</div>

									<div
										className={`-ml-2 h-2 w-36 ${
											stage == 1
												? "mr-8 bg-gradient-to-r from-blue-500 to-transparent"
												: " bg-blue-500 pr-8"
										} `}
									></div>

									<div
										className={`${
											stage == 1
												? "bg-backdrop dark:text-white"
												: " bg-blue-500 text-white"
										}  z-10 -ml-2 grid h-8 w-8 place-items-center rounded-full  font-semibold `}
									>
										2
									</div>
									<div
										className={`-ml-2 h-2 w-36 ${stage == 3 && "bg-blue-500"} ${
											stage == 2 &&
											"bg-gradient-to-r from-blue-500 to-transparent"
										}`}
									></div>

									<div
										className={`z-10 grid h-8 w-8 ${
											stage == 3
												? " bg-blue-500 text-white"
												: "bg-backdrop dark:text-white"
										} -ml-2 place-items-center rounded-full  font-semibold`}
									>
										3
									</div>
								</div>

								<AssignmentType />
								<AssignmentDetails stage={stage} setStage={setStage} />
								{stage == 3 && (
									<AssignmentCreation
										block={block}
										scheduleType={scheduleType}
										setStage={setStage}
										closeMenu={closeMenu}
										classid={classid}
									/>
								)}

								<button
									onClick={closeMenu}
									className="absolute right-4 top-4 rounded p-0.5 text-gray-700 transition hover:bg-gray-300 hover:text-gray-900 focus:outline-none dark:text-gray-100"
								>
									<XMarkIcon className="h-5 w-5" />
								</button>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</Transition.Child>
			</Dialog>
		</Transition>
	);
	function AssignmentType() {
		if (stage != 1) return null;

		return (
			<>
				<h2 className="title mt-6">Submission Type</h2>
				<div className="mt-4 grid grid-cols-3 gap-5">
					{submissionType.map((submission, i) => (
						<div key={i}>
							<div
								className={`brightness-hover h-full cursor-pointer rounded-md p-4 ${
									submission.type == assignmentData?.submissionType
										? "bg-white shadow-md dark:bg-gray-200"
										: "bg-gray-200 dark:border dark:bg-black"
								} `}
								onClick={() => {
									setAssignmentData({
										submissionType: submission.type,
										dueType: DueType.START_OF_CLASS,
										publishType: DueType.START_OF_CLASS,
										hidden: false,
									} as NewAssignmentData);
									setStage((stage) => stage + 1);
								}}
							>
								<div className="flex items-center">
									<div className="rounded-full bg-blue-500 p-2 text-white">
										{submission.icon}
									</div>
									<div className="ml-3">
										<h1 className="font-semibold">{submission.name}</h1>
										<p className="test-gray-700 text-xs">
											{submission.description}
										</p>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</>
		);
	}
};

const className = "h-5 w-5 min-w-[1.25rem] dark:brightness-90";

export const submissionType: {
	icon: ReactNode;
	name: string;
	description: string;
	type: AssignmentTypes;
}[] = [
	{
		icon: <LinkIcon className={className} />,
		name: "Link",
		description: "Submission for links",
		type: "link",
	},
	{
		icon: <DocumentTextIcon className={className} />,
		name: "Rich Media",
		description: "Submission for images, videos, etc.",
		type: "media",
	},
	{
		icon: <DocumentCheckIcon className={className} />,
		name: "Checkbox",
		description: "Checkoff, i.e. complete an assignment in a packet",
		type: "check",
	},
	{
		icon: <ChatBubbleBottomCenterTextIcon className={className} />,
		name: "Discussion Post",
		description: "Students can post discusstions and reply to others",
		type: "post",
	},
	{
		icon: <ClipboardDocumentListIcon className={className} />,
		name: "Assesment",
		description:
			"Combine free responses and/or multiple choice questions for a test",
		type: "test",
	},
	{
		icon: (
			<Image
				src="/brand-logos/googledrive.svg"
				alt="Google Logo"
				width={24}
				height={24}
				className={className + " invert"}
			/>
		),
		name: "Google Media",
		description:
			"Submission box for Google products like docs, slides, sheets, etc.",
		type: "google",
	},
];

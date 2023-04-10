import { Transition, Dialog, Listbox } from "@headlessui/react";
import {
	ChatBubbleBottomCenterTextIcon,
	ChevronUpDownIcon,
	ClipboardDocumentListIcon,
	DocumentCheckIcon,
	DocumentTextIcon,
	LinkIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { ErrorMessage, Field, Form, Formik, useFormikContext } from "formik";
import { NextPage } from "next";
import {
	Dispatch,
	Fragment,
	ReactNode,
	SetStateAction,
	useEffect,
	useState,
} from "react";
import { Button } from "../../misc/button";
import * as Yup from "yup";
import Editor from "../../editors/richeditor";
import { EditorState, SerializedEditorState } from "lexical";
import Image from "next/image";
import {
	AssignmentTypes,
	NewAssignmentData,
} from "../../../lib/db/assignments";

import AssignmentCreation, { types } from "./three";
import { DueType } from "../assignments";
import { create } from "zustand";

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
}> = ({ open, setOpen, block, scheduleType }) => {
	const [stage, setStage] = useState(1);
	const [assignmentType, setAssignmentType] = useState<AssignmentTypes>();
	const [content, setContent] = useState<SerializedEditorState>();
	const { setAssignmentData, assignmentData } = useAssignmentStore((state) => ({
		setAssignmentData: state.set,
		assignmentData: state.data,
	}));

	const closeMenu = () => {
		setOpen(false);
		setStage(1);
		setAssignmentType(undefined);
		setContent(undefined);
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
					<div className="fixed inset-0 flex items-center justify-center bg-black/20 p-4">
						<Transition.Child
							enter="ease-out transition"
							enterFrom="opacity-75 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in transition"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-75 scale-95"
							as={Fragment}
						>
							<Dialog.Panel className="relative flex w-full max-w-screen-md flex-col rounded-xl bg-white/75 p-4 shadow-md backdrop-blur-xl">
								<div className="flex items-center">
									<div className="z-10 grid h-8 w-8 place-items-center rounded-full bg-blue-500 font-semibold text-white">
										1
									</div>

									<div
										className={`-ml-2 h-2 w-36 ${
											stage == 1
												? "mr-8 bg-gradient-to-r from-blue-500 to-transparent"
												: "bg-blue-500 pr-8"
										} `}
									></div>

									<div
										className={`${
											stage == 1 ? "bg-white" : "bg-blue-500 text-white"
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
											stage == 3 ? "bg-blue-500 text-white" : " bg-white"
										} -ml-2 place-items-center rounded-full  font-semibold`}
									>
										3
									</div>
								</div>

								<AssignmentType />
								<AssignmentDetails />
								{stage == 3 && (
									<AssignmentCreation
										block={block}
										scheduleType={scheduleType}
										content={content}
										setStage={setStage}
									/>
								)}

								<button
									onClick={closeMenu}
									className="absolute right-4 top-4 rounded p-0.5 text-gray-700 transition hover:bg-gray-300 hover:text-gray-900 focus:outline-none"
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
				<h2 className="mt-6 text-xl font-bold">Submission Type</h2>
				<div className="mt-4 grid grid-cols-3 gap-5">
					{submissionType.map((submission, i) => (
						<div key={i}>
							<div
								className={`brightness-hover h-full cursor-pointer rounded-md p-4 ${
									submission.type == assignmentType
										? "bg-white shadow-md"
										: "bg-gray-200"
								} `}
								onClick={() => {
									setAssignmentType(submission.type);
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
	function AssignmentDetails() {
		const [editorState, setEditorState] = useState<EditorState>();
		const [disabled, setDisabled] = useState(true);

		if (stage != 2) return null;

		const AssignmentWatcher = () => {
			const { errors, values } = useFormikContext();

			useEffect(() => {
				if (
					Object.keys(errors).length == 0 &&
					//@ts-expect-error Formik "types" are a joke
					values.name &&
					//@ts-expect-error Formik "types" are a joke
					values.description
				) {
					setDisabled(false);
				} else {
					if (disabled != true) {
						setDisabled(true);
					}
				}
			}, [errors, values]);

			return null;
		};

		return (
			<>
				<h2 className="mt-6 text-xl font-bold">
					Create Assignment -{" "}
					{
						submissionType.find(
							(submission) => submission.type == assignmentType
						)?.name
					}
				</h2>
				<Formik
					validationSchema={Yup.object({
						name: Yup.string().min(3).max(40).required(),
						description: Yup.string().min(3).max(60).required(),
						submission: Yup.string().min(3).max(100),
					})}
					initialValues={{
						name: "",
						description: "",
						submission: "",
						...assignmentData,
					}}
					onSubmit={(values) => {
						setAssignmentData(values);
					}}
				>
					{({ submitForm }) => (
						<Form className="mt-10 flex flex-col space-y-3 ">
							<AssignmentWatcher />
							<label htmlFor="name" className="flex flex-col">
								<span className="text-sm font-medium">
									Assignment Name <span className="text-red-600">*</span>
								</span>
								<Field
									className="mt-1 rounded-md border-gray-300 bg-white/50 focus:ring-1"
									type="text"
									name="name"
								/>
								<div className="text-sm text-red-600">
									<ErrorMessage name="name" />
								</div>
							</label>
							<label htmlFor="description" className="flex flex-col">
								<span className="text-sm font-medium">
									Short Description <span className="text-red-600">*</span>
								</span>
								<Field
									className="mt-1 rounded-md border-gray-300  bg-white/50 focus:ring-1"
									type="text"
									name="description"
								/>
								<div className="text-sm text-red-600">
									<ErrorMessage name="description" />
								</div>
							</label>
							<label htmlFor="submission" className="flex flex-col">
								<span className="text-sm font-medium">
									Submission Instructions
								</span>
								<Field
									className="mt-1 rounded-md border-gray-300  bg-white/50 focus:ring-1"
									type="text"
									name="submission"
								/>
								<div className="text-sm text-red-600">
									<ErrorMessage name="submission" />
								</div>
							</label>
							<span className="text-sm font-medium">Full Description</span>
							<Editor
								editable
								updateState={setEditorState}
								initialState={content}
								className="scrollbar-fancy mt-1 mb-6 max-h-[30vh] min-h-[6rem] overflow-y-auto overflow-x-hidden rounded-md border border-gray-300 bg-white/50 pb-2 focus:ring-1"
							/>
							<div className="ml-auto flex space-x-4">
								<span onClick={() => setStage((stage) => stage - 1)}>
									<Button>Prev</Button>
								</span>

								<span
									onClick={() => {
										submitForm();
										setContent(editorState?.toJSON());
										setStage((stage) => stage + 1);
									}}
								>
									<Button
										color="bg-blue-500"
										className="text-white "
										disabled={disabled}
									>
										Next
									</Button>
								</span>
							</div>
						</Form>
					)}
				</Formik>
			</>
		);
	}
};

const className = "h-5 w-5 min-w-[1.25rem]";

const submissionType: {
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
		description: "Submission box for google docs, slides, sheets, etc.",
		type: "google",
	},
];

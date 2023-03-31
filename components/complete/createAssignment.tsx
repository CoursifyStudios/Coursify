import { Transition, Dialog } from "@headlessui/react";
import {
	ChatBubbleBottomCenterTextIcon,
	ClipboardDocumentListIcon,
	DocumentCheckIcon,
	DocumentTextIcon,
	LinkIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { Field, Form, Formik } from "formik";
import { NextPage } from "next";
import {
	Dispatch,
	Fragment,
	ReactNode,
	SetStateAction,
	useEffect,
	useState,
} from "react";
import { formatDate } from "../../lib/misc/formatDate";
import { Button } from "../misc/button";
import { getIcon } from "./achivement";
import * as Yup from "yup";
import Editor from "../editors/richeditor";
import { EditorState, SerializedEditorState } from "lexical";
import Image from "next/image";
import { AssignmentTypes } from "../../lib/db/assignments";
export const CreateAssignment: NextPage<{
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ open, setOpen }) => {
	const [stage, setStage] = useState(1);
	const [assignmentData, setAssignmentData] = useState();
	const [assignmentType, setAssignmentType] = useState<AssignmentTypes>();
	const [content, setContent] = useState<SerializedEditorState>();
	return (
		<Transition appear show={open} as={Fragment}>
			<Dialog
				open={open}
				onClose={() => {
					setOpen(false), setStage(1);
				}}
			>
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
											stage == 1
												? "border-2 border-white"
												: "bg-blue-500 text-white"
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
												? "bg-blue-500 text-white"
												: "border-2 border-white"
										} -ml-2 place-items-center rounded-full  font-semibold`}
									>
										3
									</div>
								</div>

								<AssignmentType />
								<AssignmentDetails />
								<div className="ml-auto flex space-x-4">
									{stage != 1 && (
										<>
											<span onClick={() => setStage((stage) => stage - 1)}>
												<Button>Prev</Button>
											</span>

											<span onClick={() => setStage((stage) => stage + 1)}>
												<Button color="bg-blue-500" className="text-white ">
													{stage == 3 ? "Create" : "Next"}
												</Button>
											</span>
										</>
									)}
								</div>
								<button
									onClick={() => {
										setOpen(false), setStage(1);
									}}
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

		useEffect(() => {
			setContent(editorState?.toJSON());
		}, [stage]);

		if (stage != 2) return null;

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
						name: Yup.string().min(3).max(30).required(),
						description: Yup.string().min(3).max(100).required(),
						due_date: Yup.date(),
						publish: Yup.date().required(),
					})}
					initialValues={{
						name: "",
						description: "",
						due_date: new Date(),
						publish_date: new Date(),
					}}
					onSubmit={(values) => console.log(values)}
				>
					<Form className="mt-10 mb-6 space-y-6 ">
						<label htmlFor="name" className="flex flex-col">
							<span className="text-sm font-medium">Assignment Name</span>
							<Field
								className="mt-1 rounded-md border-gray-300 bg-white/50 focus:ring-1"
								type="text"
								name="name"
							/>
						</label>
						<label htmlFor="description" className="flex flex-col">
							<span className="text-sm font-medium">Short Description</span>
							<Field
								className="mt-1 rounded-md border-gray-300  bg-white/50 focus:ring-1"
								type="text"
								name="description"
							/>
						</label>
					</Form>
				</Formik>
				<span className="text-sm font-medium">Full Description</span>
				<Editor
					editable
					updateState={setEditorState}
					className="mt-1 mb-10 rounded-md border border-gray-300 bg-white/50 focus:ring-1"
					//initialState={content}
				/>
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

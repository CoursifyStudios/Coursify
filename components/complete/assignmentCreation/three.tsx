import { Listbox, Switch } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "../../misc/button";
import Editor from "../../editors/richeditor";
import { DueType } from "../assignments";
import { NextPage } from "next";
import { SerializedEditorState, SerializedLexicalNode } from "lexical";
import { NewAssignmentData } from "../../../lib/db/assignments";

const AssignmentCreation: NextPage<{
	content?: SerializedEditorState<SerializedLexicalNode>;
	assignmentData: NewAssignmentData;
	setAssignmentData: Dispatch<SetStateAction<NewAssignmentData | undefined>>;
	setStage: Dispatch<SetStateAction<number>>;
}> = ({ content, assignmentData, setAssignmentData, setStage }) => {
	const [disabled, setDisabled] = useState(true);
	const [selectedDueType, setSelectedDueType] = useState(types[0]);
	const [selectedPublishType, setSelectedPublishType] = useState(types[0]);
	const [publish, setPublished] = useState(false);
	const [due, setDue] = useState(true);

	return (
		<>
			<section className="mt-6 flex flex-col">
				<h2 className="text-xl font-bold">{assignmentData.name}</h2>
				<p className="mt-2 text-gray-700">
					<span className="font-medium text-gray-800">Short description: </span>
					{assignmentData.description}
				</p>
				{assignmentData.submission && (
					<p className="mt-3 text-gray-700">
						<span className="font-medium text-gray-800">
							Submission Instructions:{" "}
						</span>
						{assignmentData.submission}
					</p>
				)}
				<span className="mt-3 font-medium text-gray-800">
					Full Description:{" "}
				</span>
				<Editor
					editable={false}
					initialState={content}
					className="scrollbar-fancy max-h-[30vh] overflow-y-auto"
				/>
			</section>
			<hr className="my-4" />
			<section className="grid grid-cols-2 gap-4">
				<div className="flex flex-col">
					<div className="flex justify-between">
						<p className="mb-2 font-medium text-gray-800">Publish</p>
						<Toggle enabled={publish} setEnabled={setPublished} />
					</div>
					{publish ? (
						<WhenDue type="publish" />
					) : (
						<div className="text-sm text-gray-700">
							Auto publishing is disabled. This assignment will be available
							immediately to your students.
						</div>
					)}
				</div>
				<div className="flex flex-col">
					<div className="flex justify-between">
						<p className="mb-2 font-medium text-gray-800 ">Due</p>
						<Toggle enabled={due} setEnabled={setDue} />
					</div>
					{due ? (
						<WhenDue type="due" />
					) : (
						<div className="text-sm text-gray-700">
							Due dates are disabled. This assignment will be hidden to
							students, overriding auto publishing.
						</div>
					)}
				</div>
			</section>

			<section className="ml-auto mt-6 flex space-x-4">
				<span onClick={() => setStage((stage) => stage - 1)}>
					<Button>Prev</Button>
				</span>

				<span onClick={() => setStage((stage) => stage + 1)}>
					<Button
						color="bg-blue-500"
						className="text-white "
						disabled={disabled}
					>
						Create
					</Button>
				</span>
			</section>
		</>
	);

	function WhenDue({ type }: { type: "due" | "publish" }) {
		return (
			<>
				<Listbox
					value={type == "due" ? selectedDueType : selectedPublishType}
					onChange={type == "due" ? setSelectedDueType : setSelectedPublishType}
					as="div"
					className="mr-auto flex flex-col items-center"
				>
					<Listbox.Button className="brightness-hover flex items-center rounded-xl bg-gray-200  py-1 px-2 font-semibold">
						{(type == "due" ? selectedDueType : selectedPublishType).name}{" "}
						<ChevronUpDownIcon className="ml-2 h-5 w-5" />
					</Listbox.Button>
					<Listbox.Options className="absolute mt-12 space-y-2 rounded-xl bg-white/75 p-2 backdrop-blur-xl">
						{types.map((type, i) => (
							<Listbox.Option
								key={i}
								value={type}
								className="cursor-pointer rounded-lg px-2 py-1 font-medium text-gray-700 transition hover:bg-gray-200 hover:text-gray-900"
							>
								{type.name}
							</Listbox.Option>
						))}
					</Listbox.Options>
				</Listbox>
				{type == "due"
					? selectedDueType.type == DueType.DATE && (
							<input
								type="datetime-local"
								className="mt-4 rounded-md border-gray-300  bg-white/50 focus:ring-1"
							/>
					  )
					: selectedPublishType.type == DueType.DATE && (
							<input
								type="datetime-local"
								className="mt-4 rounded-md border-gray-300  bg-white/50 focus:ring-1"
							/>
					  )}
			</>
		);
	}
};

function Toggle({
	enabled,
	setEnabled,
}: {
	enabled: boolean;
	setEnabled: Dispatch<SetStateAction<boolean>>;
}) {
	return (
		<Switch
			checked={enabled}
			onChange={setEnabled}
			className={`${
				enabled ? "bg-blue-500" : "bg-gray-200"
			} relative inline-flex h-6 w-11 items-center rounded-full transition`}
		>
			<span className="sr-only">Enable this feature</span>
			<span
				className={`${
					enabled ? "translate-x-6" : "translate-x-1"
				} inline-block h-4 w-4 transform rounded-full bg-white transition`}
			/>
		</Switch>
	);
}

export const types: { type: DueType; name: string }[] = [
	{
		type: DueType.START_OF_CLASS,
		name: "Start of class",
	},
	{
		type: DueType.END_OF_CLASS,
		name: "End of class",
	},
	{
		type: DueType.DATE,
		name: "Custom date",
	},
];

export default AssignmentCreation;

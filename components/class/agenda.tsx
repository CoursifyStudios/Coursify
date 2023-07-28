import { Field, Form, Formik } from "formik";
import { Popup } from "../misc/popup";
import { createAgenda } from "@/lib/db/classes";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { Button } from "../misc/button";
import { EditorState } from "lexical";
import Editor from "../editors/richeditor";
import { Json } from "@/lib/db/database.types";
import Link from "next/link";
import { to12hourTime } from "@/lib/db/schedule";
import { ColoredPill } from "../misc/pill";
import { useSettings } from "@/lib/stores/settings";
import { EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/outline";
import { DeleteAgenda } from "./deleteAgenda";

export const Agenda = ({
	agenda,
	assignments,
	isTeacher,
}: {
	agenda: { id: string; date: string | null; description: Json };
	assignments: {
		name: string;
		description: string;
		id: string;
		due_type: number | null;
		due_date: string | null;
	}[];
	isTeacher: boolean;
}) => {
	const [deleting, setDeleting] = useState(false);
	return (
		<>
			<DeleteAgenda
				agendaID={agenda.id}
				open={deleting}
				setOpen={setDeleting}
			></DeleteAgenda>
			<div className="bg-gray-200 p-4 rounded-lg">
				<div className="flex justify-between">
					<h2>Agenda for {agenda.date}</h2>
					{/* For the moment, I'm commenting this out because:
                a: only supporting deleting rn, editing UI later
                b: can't remember which drop down menu Lukas wants me using */}
					{/* <EllipsisVerticalIcon className="h-6 w-6" tabIndex={0}/> */}
					{/* AlSO LUKAS WHY CANT I OVERIDE THE BADDING ON THE <Button> ELEMENT */}
					{isTeacher && (
						<button
							className="hover:text-red-600"
							onClick={() => {
								setDeleting(true);
							}}
						>
							<TrashIcon className="w-6 h-6" />
						</button>
					)}
				</div>
				<Editor
					editable={false}
					initialState={agenda.description}
					className="mt-0.5"
				/>
				<div className="grid gap-2">
					{assignments.map((assignment) => (
						<Link
							key={assignment.id}
							href={"/assignments/" + assignment.id}
							className="border border-black grid rounded-md"
						>
							<CompactAssignmentUI
								assignment={assignment}
							></CompactAssignmentUI>
						</Link>
					))}
				</div>
			</div>
		</>
	);
};

export const CreateAgenda = ({
	classID,
	open,
	setOpen,
	assignments,
}: {
	classID: string;
	open: boolean;
	setOpen: (value: boolean) => void;
	assignments: {
		name: string;
		description: string;
		id: string;
		due_type: number | null;
		due_date: string | null;
	}[];
}) => {
	const supabase = useSupabaseClient();
	const [editorState, setEditorState] = useState<EditorState>();
	const [errorMessage, setErrorMessage] = useState("");
	const [chosenAssignments, setChosenAssignments] = useState<string[]>([]);
	return (
		<Popup closeMenu={() => setOpen(false)} open={open} size="md">
			<h2 className="font-semibold mb-2">Create a new Agenda</h2>
			{/* custom datepicker later probably */}
			<Formik
				initialValues={{
					date: "",
				}}
				onSubmit={async (values) => {
					setErrorMessage("");
					if (
						values.date != "" &&
						editorState &&
						editorState.toJSON().root.direction !== null
					) {
						const DBreturn = await createAgenda(
							supabase,
							classID,
							values.date,
							editorState?.toJSON() as unknown as Json,
							chosenAssignments
						);
						if (DBreturn.error) {
							setErrorMessage("Something went wrong processing your request");
						} else {
							setChosenAssignments([]); //clears your selections in the case of a succesful POST
							setOpen(false);
						}
					} else {
						setErrorMessage("Make sure to include a date and a description!");
					}
				}}
			>
				<Form className="flex flex-col w-full gap-3">
					<label htmlFor="date">
						<Field
							name="date"
							type="date"
							className="bg-backdrop/50 dark:placeholder:text-gray-400"
						></Field>
					</label>
					{/* Error handling yay */}
					<p className="text-red-500">{errorMessage}</p>
					<Editor
						editable={true}
						className="rounded-md border border-gray-300 bg-backdrop/50 p-2 "
						backdrop={false}
						updateState={setEditorState}
						initialState={""}
						focus={false}
					/>
					{/* Later, we'll need to be able to change the order of the assignments */}
					<p>Select assignments to include in this agenda:</p>
					{assignments.length > 1
						? assignments.map((assignment) => (
								<div key={assignment.id} className="flex justify-between">
									<Button
										className={`w-full ${
											chosenAssignments.indexOf(assignment.id) == -1
												? "bg-gray-200"
												: "bg-white"
										}`}
										key={assignment.id}
										type={"button"}
										onClick={() => {
											const index = chosenAssignments.indexOf(assignment.id);
											if (index == -1) {
												setChosenAssignments(
													chosenAssignments.concat(assignment.id)
												);
											} else {
												setChosenAssignments(
													chosenAssignments.filter((f) => f !== assignment.id)
												);
											}
										}}
									>
										<CompactAssignmentUI
											assignment={assignment}
											className={
												chosenAssignments.indexOf(assignment.id) == -1
													? "bg-gray-200"
													: "bg-white"
											}
										></CompactAssignmentUI>
									</Button>
								</div>
						  ))
						: "Make some assignments to include them in your agendas!"}

					<Button
						// using 300 light/ 600 dark button color schema, nonstandard for us but I like it better
						className="w-min mx-auto dark:bg-blue-600"
						color="bg-blue-300"
						type="submit"
					>
						Create
					</Button>
				</Form>
			</Formik>
		</Popup>
	);
};

const CompactAssignmentUI = ({
	assignment,
	className,
}: {
	assignment: {
		name: string;
		id: string;
		due_type: number | null;
		due_date: string | null;
	};
	className?: string;
}) => {
	const date = assignment.due_date ? new Date(assignment.due_date) : null;
	const { data: settings } = useSettings();
	return (
		<div
			key={assignment.id}
			className={`flex flex-grow justify-between p-2 ${className}`}
		>
			<p className="font-semibold">{assignment.name}</p>
			{date ? (
				<div className="grid grid-cols-2">
					<div className="mr-2 font-medium">
						{date.getMonth()}/{date.getDate()}
					</div>
					<ColoredPill color={"gray"}>
						{`${to12hourTime(date, settings.showAMPM)}`}
					</ColoredPill>
				</div>
			) : (
				<span className="text-sm italic">No due date</span>
			)}
		</div>
	);
};

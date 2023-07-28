import { Field, Form, Formik } from "formik";
import { Popup } from "../../misc/popup";
import { createAgenda, editAgenda } from "@/lib/db/classes";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { Button } from "../../misc/button";
import { EditorState } from "lexical";
import Editor from "../../editors/richeditor";
import { Json } from "@/lib/db/database.types";
import Link from "next/link";
import { to12hourTime } from "@/lib/db/schedule";
import { ColoredPill } from "../../misc/pill";
import { useSettings } from "@/lib/stores/settings";
import {
	EllipsisVerticalIcon,
	MagnifyingGlassIcon,
	PencilIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";
import { DeleteAgenda } from "./deleteAgenda";
import { LoadingSmall } from "../../misc/loading";
import { getDataOutArray } from "@/lib/misc/dataOutArray";

export const Agenda = ({
	classID,
	agenda,
	allAssignments,
	isTeacher,
}: {
	classID: string;
	agenda: {
		id: string;
		date: string | null;
		description: Json;
		assignments: string[] | null;
	};
	// Needed for editing
	allAssignments: {
		name: string;
		description: string;
		id: string;
		due_type: number | null;
		due_date: string | null;
	}[];
	isTeacher: boolean;
}) => {
	// This is a 'flag' of sorts, we'll use it to know if the agenda was actually deleted
	const [deleted, setDeleted] = useState<true | false | null>(null);
	const [deleting, setDeleting] = useState(false);
	const [editing, setEditing] = useState(false);

	const [editedAgenda, setEditedAgenda] = useState<{
		date: string | null;
		description: Json;
		assignments: string[] | null;
	} | null>(null);

	return (
		<>
			{/* Couldn't get editing the agenda directly to work, so instead we just delete it and add a new in its place (literally) */}
			{editedAgenda ? (
				<Agenda
					classID={classID}
					agenda={{
						id: agenda.id,
						date: editedAgenda.date,
						description: editedAgenda.description,
						assignments: editedAgenda.assignments,
					}}
					allAssignments={allAssignments}
					isTeacher={isTeacher}
				></Agenda>
			) : deleted ? null : (
				<div>
					{/* For Deleting Agendas */}
					<DeleteAgenda
						agendaID={agenda.id}
						open={deleting}
						setOpen={setDeleting}
						completed={setDeleted}
					></DeleteAgenda>
					{/* For Editing Agendas */}
					<CreateAgenda
						classID={classID}
						open={editing}
						setOpen={setEditing}
						assignments={allAssignments}
						createTempAgenda={setEditedAgenda}
						editingInfo={{
							id: agenda.id,
							date: agenda.date ? agenda.date : "No date",
							description: agenda.description,
							assignments: allAssignments.filter((assignment) =>
								agenda.assignments!.includes(assignment.id)
							),
						}}
					></CreateAgenda>

					<div className="bg-gray-200 p-4 rounded-lg">
						<div className="flex justify-between">
							<h2>Agenda for {agenda.date}</h2>
							{/* For the moment, I'm commenting this out because I can't remember which dropdown menu Lukas wants me using */}
							{/* <EllipsisVerticalIcon className="h-6 w-6" tabIndex={0}/> */}
							{/* TBH actually kind of liking the look w/ out dropdown
                    yeah this is better */}
							{/* AlSO LUKAS WHY CANT I OVERIDE THE PADDING ON THE <Button> ELEMENT */}
							{isTeacher && (
								<div className="gap-2 grid grid-cols-2">
									<button
										className="hover:text-green-500"
										onClick={() => {
											setEditing(true);
										}}
									>
										<PencilIcon className="w-6 h-6" />
									</button>
									<button
										className="hover:text-red-600"
										onClick={() => {
											setDeleting(true);
										}}
									>
										<TrashIcon className="w-6 h-6" />
									</button>
								</div>
							)}
						</div>
						<Editor
							editable={false}
							initialState={agenda.description}
							className="mt-0.5"
						/>
						<div className="grid gap-2">
							{allAssignments
								.filter((assignment) =>
									agenda.assignments!.includes(assignment.id)
								)
								.map((assignment) => (
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
				</div>
			)}
		</>
	);
};

export const CreateAgenda = ({
	classID,
	open,
	setOpen,
	assignments,
	createTempAgenda,
	editingInfo,
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
	createTempAgenda: (value: {
		id: string;
		class_id: string;
		date: string | null;
		description: Json;
		assignments: string[] | null;
	}) => void;
	// REQUIRED FOR EDITING, BUT NOT CREATING
	editingInfo?: {
		id: string;
		date: string;
		description: Json;
		assignments: {
			name: string;
			description: string;
			id: string;
			due_type: number | null;
			due_date: string | null;
		}[];
	};
}) => {
	const supabase = useSupabaseClient();
	const [editorState, setEditorState] = useState<EditorState>();
	const [errorMessage, setErrorMessage] = useState("");
	const [chosenAssignments, setChosenAssignments] = useState<string[]>(
		editingInfo
			? editingInfo.assignments.map((assignment) => assignment.id)
			: []
	);
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState("");

	return (
		<Popup closeMenu={() => setOpen(false)} open={open} size="md">
			<h2 className="font-semibold mb-2">Create a new Agenda</h2>
			{/* custom datepicker later probably */}
			<Formik
				initialValues={{
					date: editingInfo
						? editingInfo.date
						: // I couldn't get this working until I used this.
						  // I've found the first (and only) reason for Canada to exist!
						  new Date().toLocaleDateString("en-CA"),
				}}
				onSubmit={async (values) => {
					setErrorMessage("");
					if (
						values.date != "" &&
						editorState &&
						editorState.toJSON().root.direction !== null
					) {
						setLoading(true);
						const DBreturn = editingInfo
							? await editAgenda(supabase, editingInfo.id, {
									date: values.date,
									description: editorState?.toJSON() as unknown as Json,
									assignments: chosenAssignments,
							  })
							: await createAgenda(
									supabase,
									classID,
									values.date,
									editorState?.toJSON() as unknown as Json,
									chosenAssignments
							  );
						// FAILURE STATE
						if (DBreturn.error) {
							setLoading(false);
							setErrorMessage("Something went wrong processing your request");
							// SUCCESS STATE
						} else if (DBreturn.data) {
							setLoading(false);
							setChosenAssignments([]); //clears your selections in the case of a succesful POST
							setOpen(false);
							if (createTempAgenda) {
								createTempAgenda(getDataOutArray(DBreturn.data));
							}
						}
					} else {
						setErrorMessage("Make sure to include a date and a description!");
					}
				}}
			>
				<Form className="flex flex-col w-full gap-2">
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
						className="rounded-md border border-gray-300 bg-backdrop/50 p-2"
						updateState={setEditorState}
						initialState={editingInfo ? editingInfo.description : ""}
						focus={false}
					/>
					{/* Later, we'll need to be able to change the order of the assignments */}
					<div className="flex justify-between">
						<p>Select assignments to include in this agenda:</p>
						<div className="relative flex items-center">
							<MagnifyingGlassIcon className="absolute left-3 h-4 w-4" />
							<input
								type="text"
								className="w-48 !rounded-xl py-0.5 transition-all focus:w-96 placeholder:dark:text-gray-400 pl-8"
								placeholder="Search assignments..."
								//@ts-ignore DUDE OF COURSE e.target.value exists!
								onInput={(e) => setSearch(e.target.value)}
							/>
						</div>
					</div>
					<div className="overflow-auto max-h-80 gap-3 grid">
						{assignments.length > 0
							? assignments.map(
									(assignment) =>
										(search.length == 0
											? true
											: assignment.name
													.toLowerCase()
													.includes(search.toLowerCase())) && (
											<div key={assignment.id} className="flex justify-between">
												<Button
													className={`w-full ${
														chosenAssignments.indexOf(assignment.id) == -1
															? "bg-gray-300"
															: "bg-white dark:bg-black border border-black dark:border-white outline-1"
													}`}
													key={assignment.id}
													type={"button"}
													onClick={() => {
														const index = chosenAssignments.indexOf(
															assignment.id
														);
														if (index == -1) {
															setChosenAssignments(
																chosenAssignments.concat(assignment.id)
															);
														} else {
															setChosenAssignments(
																chosenAssignments.filter(
																	(f) => f !== assignment.id
																)
															);
														}
													}}
												>
													<CompactAssignmentUI
														assignment={assignment}
														className={
															chosenAssignments.indexOf(assignment.id) == -1
																? "bg-gray-300"
																: "bg-white dark:bg-black"
														}
													></CompactAssignmentUI>
												</Button>
											</div>
										)
							  )
							: "Make some assignments to include them in your agendas!"}
					</div>

					<Button
						// using 300 light/ 600 dark button color schema, nonstandard for us but I like it better
						className="w-min mx-auto dark:bg-blue-600 gap-4"
						color="bg-blue-300"
						type="submit"
					>
						{editingInfo ? "Save" : "Create"}
						{loading && <LoadingSmall />}
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

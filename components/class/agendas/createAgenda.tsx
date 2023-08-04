import { Button } from "@/components/misc/button";
import { LoadingSmall } from "@/components/misc/loading";
import { Popup } from "@/components/misc/popup";
import { editAgenda, createAgenda } from "@/lib/db/classes";
import { Json } from "@/lib/db/database.types";
import { getDataOutArray } from "@/lib/misc/dataOutArray";
import Editor from "../../editors/richeditor";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Formik, Form, Field } from "formik";
import { EditorState } from "lexical";
import { useState } from "react";
import { CompactAssignmentUI } from "./agenda";

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
			<h2 className="title-sm">Create a new Agenda</h2>
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
				<Form className="flex flex-col w-full gap-4">
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
					</div>
					<div className="relative flex items-center">
						<MagnifyingGlassIcon className="absolute left-3 h-4 w-4" />
						<input
							type="text"
							className="w-56 !rounded-xl py-0.5 transition-all focus:w-96 placeholder:dark:text-gray-400 pl-8"
							placeholder="Search assignments..."
							//@ts-ignore DUDE OF COURSE e.target.value exists!
							onInput={(e) => setSearch(e.target.value)}
						/>
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
															: "bg-white dark:bg-black border border-black dark:border-white outline-0.5"
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
														selected={
															chosenAssignments.indexOf(assignment.id) != -1
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
						className="w-min mx-auto gap-4"
						color="bg-blue-500"
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

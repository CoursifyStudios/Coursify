import { Button } from "@/components/misc/button";
import { LoadingSmall } from "@/components/misc/loading";
import { Popup } from "@/components/misc/popup";
import { Json } from "@/lib/db/database.types";
import { getDataOutArray } from "@/lib/misc/dataOutArray";
import Editor from "../../editors/richeditor";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Formik, Form, Field } from "formik";
import { EditorState } from "lexical";
import { useEffect, useState } from "react";
import { CompactAssignmentUI } from "./agenda";
import { createAgenda, editAgenda, searchDB } from "@/lib/db/agendas";
import { Info } from "@/components/tooltips/info";
import GenericFileUpload, {
	CoursifyFile,
} from "@/components/files/genericFileUpload";

export const CreateAgenda = ({
	classID,
	open,
	setOpen,
	assignments,
	createTempAgenda,
	assignmentUpdater,
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
		files: CoursifyFile[] | null;
	}) => void;
	assignmentUpdater: (
		val: {
			name: string;
			description: string;
			id: string;
			due_type: number | null;
			due_date: string | null;
		}[]
	) => void;
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
		files: CoursifyFile[];
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
	const [files, setFiles] = useState<CoursifyFile[]>(
		editingInfo ? editingInfo.files : []
	);
	// Loading states
	const [loading, setLoading] = useState(false);
	const [searching, setSearching] = useState(false);
	//searching
	const [query, setQuery] = useState("");
	const [searchChangedSinceReq, setSearchChangedSinceReq] = useState(false);
	const [searchErrorMessage, setSearchErrorMessage] = useState("");
	const [results, setResults] = useState<
		{
			name: string;
			description: string;
			id: string;
			due_type: number | null;
			due_date: string | null;
		}[]
	>();

	async function search() {
		setSearchErrorMessage("");
		setSearchChangedSinceReq(false);
		setSearching(true);
		const retrievedAssignments = await searchDB(
			supabase,
			query,
			classID,
			assignments.map((assignment) => assignment.id)
		);
		if (retrievedAssignments.data) {
			setSearching(false);
			if (retrievedAssignments.data.length == 0) {
				setSearchErrorMessage("No assignments matched your search");
			}
			setResults(retrievedAssignments.data);
			assignmentUpdater(retrievedAssignments.data);
		} else if (retrievedAssignments.error) {
			setSearching(false);
			setSearchErrorMessage("Something went wrong processing your request");
		}
	}

	useEffect(() => {
		if (searchChangedSinceReq) {
			setSearchErrorMessage("");
		}
	}, [searchChangedSinceReq]);

	return (
		<Popup
			closeMenu={() => {
				setOpen(false);
				setQuery("");
				if (!editingInfo && files.length > 0) {
					(async () => {
						const deletion = await supabase.functions.invoke("delete-file", {
							body: {
								path: files.map((file) => `agendas/${file.fileName}`),
							},
						});
						//tbh no idea how we would even approach error handling for this... -Bill
					})();
					setFiles([]);
				}
			}}
			open={open}
			size="md"
		>
			<h2 className="title-sm mb-2">
				{editingInfo ? "Edit your agenda" : "Create a new Agenda"}
			</h2>
			<Formik
				initialValues={{
					date: editingInfo
						? new Date(editingInfo.date).toLocaleDateString("en-CA")
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
									files: files as unknown as Json[],
							  })
							: await createAgenda(
									supabase,
									classID,
									values.date,
									editorState?.toJSON() as unknown as Json,
									chosenAssignments,
									files as unknown as Json[]
							  );
						// FAILURE STATE
						if (DBreturn.error) {
							setLoading(false);
							setErrorMessage("Something went wrong processing your request");
							// SUCCESS STATE
						} else if (DBreturn.data) {
							setLoading(false);
							setQuery("");
							setChosenAssignments([]); //clears your selections in the case of a succesful POST
							setFiles([]);
							setOpen(false);
							if (createTempAgenda) {
								const actualData = getDataOutArray(DBreturn.data);
								createTempAgenda({
									id: actualData.id,
									class_id: actualData.class_id,
									date: actualData.date,
									description: actualData.description,
									assignments: actualData.assignments,
									files: actualData.files as unknown as CoursifyFile[],
								});
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
						className="rounded border overflow-hidden border-gray-300 bg-backdrop/50"
						updateState={setEditorState}
						initialState={editingInfo ? editingInfo.description : ""}
						focus={false}
					/>
					<GenericFileUpload setFiles={setFiles} files={files} />
					{/* Later, we'll need to be able to change the order of the assignments */}
					<div className="flex">
						<p>Select assignments to include in this agenda:</p>
					</div>
					{/* Searching */}
					<div className="relative flex items-center mb-2">
						<MagnifyingGlassIcon className="absolute left-3 h-4 w-4" />
						<input
							type="text"
							className="max-w-[24rem] grow !rounded-xl py-1 placeholder:dark:text-gray-400 pl-8"
							placeholder="Search assignments..."
							onInput={(e) => {
								//@ts-ignore DUDE OF COURSE e.target.value exists!
								setQuery(e.target.value);
								setSearchChangedSinceReq(true);
							}}
							onKeyUp={(key) => {
								if (
									(key.key == "Enter" ||
										key.key == " " ||
										key.key == "Return") &&
									query.trim().length > 0 &&
									searchChangedSinceReq
								) {
									search();
								}
							}}
							onKeyDown={(e) => e.key == "Enter" && e.preventDefault()}
						/>
						<Info className="ml-2" icon={<p className="text-sm">Tip!</p>}>
							Pressing enter or the search button will load more assignments
							that match your search
						</Info>
						<Button
							type="button"
							disabled={searching}
							className="ml-auto gap-2"
							onClick={() => {
								search();
							}}
						>
							Search{searching && "ing"}
							{searching && <LoadingSmall></LoadingSmall>}
						</Button>
					</div>
					<p className="text-red-500">{searchErrorMessage}</p>
					<div className="overflow-auto max-h-80 gap-3 grid">
						{assignments.length > 0
							? Array.from(
									new Set(assignments.concat(results ? results : []))
							  ).map(
									(assignment) =>
										(query.length == 0
											? true
											: assignment.name
													.toLowerCase()
													.includes(query.toLowerCase())) && (
											<div key={assignment.id} className="">
												<Button
													className={`w-full ${
														chosenAssignments.indexOf(assignment.id) == -1
															? "bg-gray-300"
															: "bg-gray-300"
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
														picker={true}
													></CompactAssignmentUI>
												</Button>
											</div>
										)
							  )
							: "Make some assignments to include them in your agendas!"}
					</div>
					<Button
						// using 300 light/ 600 dark button color schema, nonstandard for us but I like it better
						className="w-min mx-auto text-white gap-4"
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

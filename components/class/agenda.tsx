import { Field, Form, Formik } from "formik";
import { Popup } from "../misc/popup";
import { createAgenda } from "@/lib/db/classes";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { Button } from "../misc/button";
import { EditorState } from "lexical";
import Editor from "../editors/richeditor";
import { Json } from "@/lib/db/database.types";

export const Agenda = ({
	id,
	date,
	description,
	assignments,
}: {
	id: string;
	date: Date;
	description: string;
	assignments: {
		name: string;
		description: string;
		id: string;
		due_type: number | null;
		due_date: string | null;
	}[];
}) => {
	return (
		<div className="bg-gray-200 p-4">
			<h2>Agenda for {date.toLocaleDateString()}</h2>
			<p>{description}</p>
			{assignments.map((assignment) => (
				<CompactAssignmentUI
					key={assignment.id}
					assignment={assignment}
				></CompactAssignmentUI>
			))}
		</div>
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
	const [chosenAssignments, setChosenAssignments] = useState<string[]>([]);
	return (
		<Popup closeMenu={() => setOpen(false)} open={open} size="md">
			<h2 className="font-semibold mb-2">Create a new Agenda</h2>
			{/* custom datepicker later probably */}
			<Formik
				initialValues={{
					date: "",
				}}
				onSubmit={(values) => {
					console.log(
						createAgenda(
							supabase,
							classID,
							values.date,
							editorState?.toJSON() as unknown as Json,
							chosenAssignments
						)
					);
				}}
			>
				<Form className="flex flex-col w-full gap-3">
					<label htmlFor="date">
						<Field name="date" type="date"></Field>
					</label>
					<Editor
						editable={true}
						className="mt-4 rounded-md border border-gray-300 bg-backdrop/50 p-2 "
						backdrop={false}
						updateState={setEditorState}
						initialState={""}
						focus={false}
					/>
					{/* regular button for speedy dev.t */}
					<p>Select assignments to include in this agenda:</p>
					{assignments.length > 1
						? assignments.map((assignment) => (
								<Button
									className="flex justify-between"
									key={assignment.id}
									type={"button"}
									onClick={() =>
										setChosenAssignments(
											chosenAssignments.concat(assignment.id)
										)
									}
								>
									<CompactAssignmentUI
										assignment={assignment}
									></CompactAssignmentUI>
									<p>x</p>
								</Button>
						  ))
						: "Make some assignments to include them in your agenda!"}

					<button type="submit">Create</button>
				</Form>
			</Formik>
		</Popup>
	);
};

const CompactAssignmentUI = ({
	assignment,
}: {
	assignment: {
		name: string;
		id: string;
		due_type: number | null;
		due_date: string | null;
	};
}) => {
	return (
		<div key={assignment.id} className="flex justify-between bg-gray-200 p-2">
			<p className="font-semibold">{assignment.name}</p>
			{/* TODO: parse that */}
			<p>Due: {assignment.due_date}</p>
		</div>
	);
};

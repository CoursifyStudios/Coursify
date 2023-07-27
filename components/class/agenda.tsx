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

export const Agenda = ({
	agenda,
	assignments,
}: {
	agenda: { id: string; date: string | null; description: Json };
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
			<h2>Agenda for {agenda.date}</h2>
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
						className="border-2 border-black grid rounded-md"
					>
						<CompactAssignmentUI assignment={assignment}></CompactAssignmentUI>
					</Link>
				))}
			</div>
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
							setOpen(false);
						}
					} else {
						setErrorMessage("Make sure to include a date and a description!");
					}
				}}
			>
				<Form className="flex flex-col w-full gap-3">
					<label htmlFor="date">
						<Field name="date" type="date"></Field>
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
	const date = assignment.due_date ? new Date(assignment.due_date) : null;
	const { data: settings } = useSettings();
	return (
		<div key={assignment.id} className="flex justify-between bg-gray-200 p-2">
			<p className="font-semibold">{assignment.name}</p>
			{/* TODO: parse that */}
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

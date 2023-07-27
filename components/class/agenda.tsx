import { Field, Form, Formik } from "formik";
import { Popup } from "../misc/popup";
import { createAgenda } from "@/lib/db/classes";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { Button } from "../misc/button";

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
	const [chosenAssignments, setChosenAssignments] = useState<string[]>([]);
	return (
		<Popup closeMenu={() => setOpen(false)} open={open} size="md">
			<h2 className="font-semibold mb-2">Create a new Agenda</h2>
			{/* custom datepicker later probably */}
			<Formik
				initialValues={{
					date: new Date(),
					description: "",
				}}
				onSubmit={(values) => {
					createAgenda(
						supabase,
						classID,
						values.date.toTimeString(),
						values.description,
						chosenAssignments
					);
				}}
			>
				<Form className="flex flex-col gap-3 w-full">
					<label htmlFor="date">
						<Field name="date" type="date"></Field>
					</label>
					<label htmlFor="description">
						<Field
							name="description"
							type="text"
							placeholder="Tell us what's happening that day..."
						></Field>
					</label>
					{/* regular button for speedy dev.t */}
					<p>Select assignments to include in this agenda:</p>
					{assignments.length > 1
						? assignments.map((assignment) => (
								<Button
									className="flex justify-between"
									key={assignment.id}
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
		<div key={assignment.id} className="flex justify-between bg-gray-200 p-4">
			<p className="font-semibold">{assignment.name}</p>
			{/* TODO: parse that */}
			<p>Due: {assignment.due_date}</p>
		</div>
	);
};

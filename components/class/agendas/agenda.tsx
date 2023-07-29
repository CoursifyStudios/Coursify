import { useState } from "react";
import Editor from "../../editors/richeditor";
import { Json } from "@/lib/db/database.types";
import Link from "next/link";
import { to12hourTime } from "@/lib/db/schedule";
import { ColoredPill } from "../../misc/pill";
import { useSettings } from "@/lib/stores/settings";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { DeleteAgenda } from "./deleteAgenda";
import { CreateAgenda } from "./createAgenda";

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

export const CompactAssignmentUI = ({
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

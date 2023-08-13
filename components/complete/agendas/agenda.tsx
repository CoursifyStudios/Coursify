import { useState } from "react";
import Editor from "../../editors/richeditor";
import { Json } from "@/lib/db/database.types";
import Link from "next/link";
import { to12hourTime } from "@/lib/db/schedule";
import { ColoredPill } from "../../misc/pill";
import { useSettings } from "@/lib/stores/settings";
import {
	CheckCircleIcon,
	MinusCircleIcon,
	PencilIcon,
	PlusCircleIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";
import { DeleteAgenda } from "./deleteAgenda";
import { CreateAgenda } from "./createAgenda";

export const Agenda = ({
	classID,
	agenda,
	allAssignments,
	assignmentUpdater,
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
	//also needed for editing
	assignmentUpdater: (
		val: {
			name: string;
			description: string;
			id: string;
			due_type: number | null;
			due_date: string | null;
		}[]
	) => void;
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
			{/* Couldn't get editing the agenda directly to work, so instead we just delete it and add a new one in its place */}
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
					assignmentUpdater={assignmentUpdater}
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
						assignmentUpdater={assignmentUpdater}
						editingInfo={{
							id: agenda.id,
							date: agenda.date ? agenda.date : "No date",
							description: agenda.description,
							assignments: allAssignments.filter((assignment) =>
								agenda.assignments!.includes(assignment.id)
							),
						}}
					></CreateAgenda>

					<div className="w-full bg-gray-200 p-4 rounded-lg">
						<div className="w-full flex justify-between">
							<h2 className="w-full font-bold text-lg">
								{new Date(agenda.date!).toLocaleDateString("en-US", {
									weekday: "long",
									month: "long",
									day: "numeric",
								})}
							</h2>
							{isTeacher && (
								<div className="w-full gap-2 grid grid-cols-2">
									<button
										className="w-full hover:text-green-500"
										onClick={() => {
											setEditing(true);
										}}
									>
										<PencilIcon className="w-full w-6 h-6" />
									</button>
									<button
										className="w-full hover:text-red-600"
										onClick={() => {
											setDeleting(true);
										}}
									>
										<TrashIcon className="w-full w-6 h-6" />
									</button>
								</div>
							)}
						</div>
						<Editor
							editable={false}
							initialState={agenda.description}
							className="w-full my-0.5"
						/>
						<div className="w-full grid grid-cols-1 gap-2">
							{true &&
								allAssignments
									.filter(
										(assignment) =>
											agenda.assignments &&
											agenda.assignments.includes(assignment.id)
									)
									.map((assignment) => (
										<Link
											key={assignment.id}
											href={"/assignments/" + assignment.id}
											className="w-full  grid rounded-md"
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
	picker,
	selected,
}: {
	assignment: {
		name: string;
		id: string;
		due_type: number | null;
		due_date: string | null;
	};
	picker?: boolean;
	className?: string;
	selected?: boolean;
}) => {
	const date = assignment.due_date ? new Date(assignment.due_date) : null;
	const { data: settings } = useSettings();
	const [hovered, setHovered] = useState(false);
	return (
		<div
			onMouseEnter={(e) => setHovered(true)}
			onMouseLeave={(e) => setHovered(false)}
			key={assignment.id}
			className={`flex flex-grow justify-between p-2 bg-gray-300 rounded-md ${className}`}
		>
			<p className="w-full font-semibold">{assignment.name}</p>
			<div className="w-full flex gap-2">
				{date ? (
					<div className="w-full grid grid-cols-2">
						<div className="w-full  font-medium">
							{date.getMonth() + 1}/{date.getDate()}
						</div>
						<ColoredPill color={"gray"}>
							{`${to12hourTime(date, settings.showAMPM)}`}
						</ColoredPill>
					</div>
				) : (
					<span className="w-full text-sm italic">No due date</span>
				)}
				{picker && hovered ? (
					selected ? (
						<MinusCircleIcon className="w-full w-6 h-6 stroke-red-500" />
					) : (
						<PlusCircleIcon className="w-full w-6 h-6 stroke-green-500" />
					)
				) : selected ? (
					<CheckCircleIcon className="w-full w-6 h-6" />
				) : (
					<div className="w-full "></div>
				)}
			</div>
		</div>
	);
};

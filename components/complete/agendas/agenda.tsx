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
import { CoursifyFile } from "@/components/files/genericFileUpload";
import { mediaFileExtensions } from "@/components/files/genericFileView";
import { ImagePreview } from "@/components/files/imagePreview";
import { DownloadableFile } from "@/components/files/downloadableFile";

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
		files: CoursifyFile[] | null;
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
		files: CoursifyFile[] | null;
	} | null>(null);
	const dateFormat = new Intl.DateTimeFormat("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
		timeZone: "Europe/London",
	});
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
						files: editedAgenda.files,
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
						agendaFiles={agenda.files?.map(
							(file) => `agendas/${file.fileName}`
						)}
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
							files: agenda.files ?? [],
						}}
					></CreateAgenda>

					<div className="bg-gray-200 p-4 rounded-lg">
						<div className="flex justify-between">
							<h2 className="font-bold text-lg">
								{dateFormat.format(new Date(agenda.date!))}
							</h2>
							{isTeacher && (
								<div className="gap-2 grid grid-cols-2">
									<button
										className="hover:text-green-500"
										onClick={() => {
											setEditing(true);
										}}
										title="Edit this agenda"
									>
										<PencilIcon className="w-6 h-6" />
									</button>
									<button
										className="hover:text-red-600"
										onClick={() => {
											setDeleting(true);
										}}
										title="Delete this agenda"
									>
										<TrashIcon className="w-6 h-6" />
									</button>
								</div>
							)}
						</div>
						<Editor
							editable={false}
							initialState={agenda.description}
							className="my-0.5"
						/>
						<div className="flex mb-2">
							{agenda.files?.map(
								(file, index) =>
									!mediaFileExtensions.includes(
										file.realName.split(".").pop() || ""
									) && <DownloadableFile key={index} file={file} />
							)}
						</div>
						<div className="flex gap-4 overflow-x-auto">
							{agenda.files?.map(
								(file, index) =>
									mediaFileExtensions.includes(
										file.realName.split(".").pop() || ""
									) && <ImagePreview key={index} file={file} />
							)}
						</div>
						<div className="grid grid-cols-1 gap-2">
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
											className=" grid rounded-md"
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
			<p className="font-semibold">{assignment.name}</p>
			<div className="flex gap-2">
				{date ? (
					<div className="grid grid-cols-2">
						<div className=" font-medium">
							{date.getMonth() + 1}/{date.getDate()}
						</div>
						<ColoredPill color={"gray"}>
							{`${to12hourTime(date, settings.showAMPM)}`}
						</ColoredPill>
					</div>
				) : (
					<span className="text-sm italic">No due date</span>
				)}
				{picker && hovered ? (
					selected ? (
						<MinusCircleIcon className="w-6 h-6 stroke-red-500" />
					) : (
						<PlusCircleIcon className="w-6 h-6 stroke-green-500" />
					)
				) : selected ? (
					<CheckCircleIcon className="w-6 h-6" />
				) : (
					<div className=""></div>
				)}
			</div>
		</div>
	);
};

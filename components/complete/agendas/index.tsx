import { Button } from "@/components/misc/button";
import { LoadingSmall } from "@/components/misc/loading";
import { fetchAgendasAndAssignments } from "@/lib/db/agendas";
import { Json } from "@/lib/db/database.types";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Agenda } from "./agenda";
import { CreateAgenda } from "./createAgenda";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { getTheseAssignments } from "@/lib/db/assignments/assignments";
import { CoursifyFile } from "@/components/files/genericFileUpload";

export const AgendasModule = ({
	classID,
	agendas,
	updateAgendas,
	allAssignments,
	isTeacher,
	assignmentUpdater,
	fetchExtra,
}: {
	classID: string;
	agendas: {
		class_id: string;
		id: string;
		date: string | null;
		description: Json;
		assignments: string[] | null;
		files: CoursifyFile[] | null;
	}[];
	updateAgendas: (
		val: {
			class_id: string;
			id: string;
			date: string | null;
			description: Json;
			assignments: string[] | null;
			files: CoursifyFile[] | null;
		}[]
	) => void;
	// Needed for editing
	allAssignments: {
		name: string;
		description: string;
		id: string;
		due_type: number | null;
		due_date: string | null;
	}[];
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
	fetchExtra: { isOK: boolean; setOK: (value: boolean) => void };
}) => {
	const supabase = useSupabaseClient();
	const [agendaCreationOpen, setAgendaCreationOpen] = useState(false);
	// Loading state controls
	const [loadingPastAgendas, setLoadingPastAgendas] = useState(false);
	const [loadingFutureAgendas, setLoadingFutureAgendas] = useState(false);
	// Error handling
	const [newAgendasError, setNewAgendasError] = useState("");
	const [oldAgendasError, setOldAgendasError] = useState("");

	// To prevent against the case where the few assignments fetched from the DB
	// do not include all of the ones that our agendas need, we will fetch the DB
	// again (after initial load though, it's okay (I think)).

	useEffect(() => {
		(async () => {
			const allAssignmentIDs = allAssignments.map(
				(assignment) => assignment.id
			);
			if (supabase && allAssignments && fetchExtra.isOK) {
				const extraAssignments = await getTheseAssignments(
					supabase,
					classID,
					// all agendas fetched from the initial DB request
					agendas
						// we need to do some filtering, then flatten, so flatMap is useful here
						.flatMap((agenda) =>
							// all assignments attached to a particular agenda
							agenda.assignments
								? agenda.assignments.filter(
										(assignment) =>
											// filter to make sure that this assignment was not already fetched
											allAssignmentIDs.indexOf(assignment) === -1
								  )
								: []
						)
				);
				if (extraAssignments.data) {
					assignmentUpdater(extraAssignments.data);
					fetchExtra.setOK(false);
				}
			}
		})();
		// finally fixed
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [supabase, classID]);
	return (
		<div>
			{isTeacher && (
				<div
					tabIndex={0}
					onClick={() => setAgendaCreationOpen(true)}
					className="mt-4 mb-2 group flex h-24 grow cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 transition hover:border-solid hover:bg-gray-50 hover:text-black dark:hover:bg-neutral-950 dark:hover:text-white"
				>
					<PlusIcon className="-ml-4 mr-4 h-8 w-8 transition group-hover:scale-125" />{" "}
					<h3 className="text-lg font-medium transition">New Agenda</h3>
				</div>
			)}
			{isTeacher && (
				<CreateAgenda
					classID={classID}
					open={agendaCreationOpen}
					setOpen={setAgendaCreationOpen as (v: boolean) => void}
					assignments={allAssignments}
					assignmentUpdater={assignmentUpdater}
					createTempAgenda={(newAgenda: {
						id: string;
						class_id: string;
						date: string | null;
						description: Json;
						assignments: string[] | null;
						files: CoursifyFile[] | null;
					}) => updateAgendas([newAgenda])}
				></CreateAgenda>
			)}
			<Button
				className="mb-2 mx-auto"
				onClick={async () => {
					setLoadingFutureAgendas(true);
					const moreAgendasAndAssignments = await fetchAgendasAndAssignments(
						supabase,
						classID as string,
						agendas.map((agenda) => agenda.id),
						allAssignments.map((assignment) => assignment.id),
						agendas.length == 0
							? new Date().toLocaleDateString("en-CA")
							: agendas.sort(
									(a, b) =>
										new Date(b.date!).getTime() - new Date(a.date!).getTime()
							  )[0].date!,
						true
					);

					setLoadingFutureAgendas(false);
					if (moreAgendasAndAssignments.fetchedAgendas.data) {
						if (moreAgendasAndAssignments.fetchedAgendas.data.length == 0) {
							setNewAgendasError("All future agendas have been fetched.");
						} else {
							updateAgendas(
								moreAgendasAndAssignments.fetchedAgendas.data.map((agenda) => {
									return {
										...agenda,
										files: agenda.files as unknown as CoursifyFile[],
									};
								})
							);
						}
					} else {
						setNewAgendasError("An error occured while fetching your agendas.");
					}
					if (moreAgendasAndAssignments.fetchedAssignments?.data) {
						assignmentUpdater(
							moreAgendasAndAssignments.fetchedAssignments?.data
						);
					}
				}}
			>
				Load Newer Agendas
				{loadingFutureAgendas && <LoadingSmall className="ml-4" />}
			</Button>
			<div className="flex gap-2">
				<p className="text-red-500">{newAgendasError}</p>
				<p
					className="text-red-500 underline"
					tabIndex={0}
					onClick={() => setNewAgendasError("")}
				>
					{newAgendasError.length > 0 && "Dismiss"}
				</p>
			</div>
			<div className="gap-3 grid">
				{agendas
					.slice()
					.sort(
						(a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()
					)
					.map((agenda) => (
						<Agenda
							key={agenda.id}
							classID={classID}
							agenda={agenda}
							allAssignments={allAssignments}
							assignmentUpdater={assignmentUpdater}
							isTeacher={isTeacher ? true : false}
						></Agenda>
					))}
			</div>
			<Button
				className="mt-3 mx-auto"
				onClick={async () => {
					setLoadingPastAgendas(true);
					const moreAgendasAndAssignments = await fetchAgendasAndAssignments(
						supabase,
						classID,
						agendas.map((agenda) => agenda.id),
						allAssignments.map((assignment) => assignment.id),
						agendas.length == 0
							? new Date().toLocaleDateString("en-CA")
							: agendas.sort(
									(a, b) =>
										new Date(a.date!).getTime() - new Date(b.date!).getTime() // sorting in reverse order for this
							  )[0].date!,
						false
					);

					setLoadingPastAgendas(false);
					if (moreAgendasAndAssignments.fetchedAgendas.data) {
						if (moreAgendasAndAssignments.fetchedAgendas.data.length == 0) {
							setNewAgendasError("All future agendas have been fetched.");
						} else {
							updateAgendas(
								moreAgendasAndAssignments.fetchedAgendas.data.map((agenda) => {
									return {
										...agenda,
										files: agenda.files as unknown as CoursifyFile[],
									};
								})
							);
						}
					} else {
						setNewAgendasError("An error occured while fetching your agendas.");
					}
					if (moreAgendasAndAssignments.fetchedAssignments?.data) {
						assignmentUpdater(
							moreAgendasAndAssignments.fetchedAssignments?.data
						);
					}
				}}
			>
				Load Past Agendas
				{loadingPastAgendas && <LoadingSmall className="ml-4" />}
			</Button>
			<div className="flex gap-2">
				<p className="text-red-500">{oldAgendasError}</p>
				<p
					tabIndex={0}
					className="text-red-500 underline"
					onClick={() => setOldAgendasError("")}
				>
					{oldAgendasError.length > 0 && "Dismiss"}
				</p>
			</div>
		</div>
	);
};

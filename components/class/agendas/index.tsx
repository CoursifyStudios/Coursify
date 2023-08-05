import { Button } from "@/components/misc/button";
import { LoadingSmall } from "@/components/misc/loading";
import { fetchMoreAgendas } from "@/lib/db/agendas";
import { Json } from "@/lib/db/database.types";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Agenda } from "./agenda";
import { CreateAgenda } from "./createAgenda";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { getAllAssignmentsButNotThese } from "@/lib/db/assignments/assignments";

export const AgendasModule = ({
	classID,
	agendas,
	allAssignments,
	isTeacher,
	assignmentUpdater,
}: {
	classID: string;
	agendas: {
		class_id: string;
		id: string;
		date: string | null;
		description: Json;
		assignments: string[] | null;
	}[];
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
}) => {
	const supabase = useSupabaseClient();
	const [allAssignmentsForAgendas, setAllAssignmentsForAgendas] = useState(
		new Set(allAssignments)
	);
	const [agendaCreationOpen, setAgendaCreationOpen] = useState(false);
	const [createdAgendas, setCreatedAgendas] = useState<
		{
			id: string;
			class_id: string;
			date: string | null; //shouldn't ever be null, but too lazy to change DB
			description: Json;
			assignments: string[] | null; // same case as two lines above
		}[]
	>([]);
	const [extraAgendas, setExtraAgendas] = useState<
		{
			id: string;
			class_id: string;
			date: string | null;
			description: Json;
			assignments: string[] | null;
		}[]
	>([]);
	const [loadingPastAgendas, setLoadingPastAgendas] = useState(false);
	const [loadingFutureAgendas, setLoadingFutureAgendas] = useState(false);
	const [newAgendasError, setNewAgendasError] = useState("");
	const [oldAgendasError, setOldAgendasError] = useState("");

	// To prevent against the case where the few assignments fetched from the DB
	// do not include all of the ones that our agendas need, we will fetch the DB
	// again (after initial load though, it's okay (I think)).
	useEffect(() => {
		(async () => {
			// const setOfLoadedAssignments = new Set(
			// 	agendas // from initial page load
			// 		.concat(createdAgendas) // newly created
			// 		.concat(extraAgendas)
			// 		.map((agenda) => (agenda.assignments ? agenda.assignments : []))
			// 		.flat()
			// ); // from Load More
			const extraAssignments = await getAllAssignmentsButNotThese(
				supabase,
				classID,
				allAssignments.map((assignment) => assignment.id)
			);
			if (extraAssignments.data) {
				assignmentUpdater(extraAssignments.data);
				setAllAssignmentsForAgendas(
					new Set([...allAssignmentsForAgendas, ...extraAssignments.data])
				);
			}
		})();
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
					assignments={Array.from(allAssignmentsForAgendas)} //somehow there were duplicated assignments here
					createTempAgenda={(newAgenda: {
						id: string;
						class_id: string;
						date: string | null;
						description: Json;
						assignments: string[] | null;
					}) => setCreatedAgendas(createdAgendas.concat(newAgenda))}
				></CreateAgenda>
			)}
			<Button
				className="mb-2 mx-auto"
				onClick={async () => {
					setLoadingFutureAgendas(true);
					const allAgendas = agendas // from initial page load
						.concat(createdAgendas) // newly created
						.concat(extraAgendas); // from Load More
					const moreAgendas = await fetchMoreAgendas(
						supabase,
						classID as string,
						allAgendas.map((agenda) => agenda.id),
						allAgendas.length == 0
							? new Date().toLocaleDateString("en-CA")
							: allAgendas.sort(
									(a, b) =>
										new Date(b.date!).getTime() - new Date(a.date!).getTime()
							  )[0].date!,
						true
					);

					setLoadingFutureAgendas(false);
					if (moreAgendas.data?.length == 0) {
						setNewAgendasError("All future agendas have been fetched");
					} else if (moreAgendas.data) {
						setExtraAgendas(extraAgendas.concat(moreAgendas.data));
					} else {
						setNewAgendasError("An error occured while fetching your agendas");
					}
				}}
			>
				Load Newer Agendas
				{loadingFutureAgendas && <LoadingSmall className="ml-4" />}
			</Button>
			<p className="text-red-500">{newAgendasError}</p>
			<div className="gap-3 grid">
				{createdAgendas // newly created ones (client side before page refresh)
					.concat(extraAgendas) // from "Load More" button
					.concat(agendas) // from initial DB request
					.slice()
					.sort(
						(a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()
					)
					.map((agenda) => (
						<Agenda
							key={agenda.id}
							classID={classID}
							agenda={agenda}
							allAssignments={Array.from(allAssignmentsForAgendas)}
							isTeacher={isTeacher ? true : false}
						></Agenda>
					))}
			</div>
			<Button
				className="mt-3 mx-auto"
				onClick={async () => {
					setLoadingPastAgendas(true);
					const allAgendas = agendas // from initial page load
						.concat(createdAgendas) // newly created
						.concat(extraAgendas); // from Load More
					const moreAgendas = await fetchMoreAgendas(
						supabase,
						classID,
						allAgendas.map((agenda) => agenda.id),
						allAgendas.length == 0
							? new Date().toLocaleDateString("en-CA")
							: allAgendas.sort(
									(a, b) =>
										new Date(a.date!).getTime() - new Date(b.date!).getTime() // sorting in reverse order for this
							  )[0].date!,
						false
					);

					setLoadingPastAgendas(false);
					if (moreAgendas.data?.length == 0) {
						setOldAgendasError("All past agendas have been fetched");
					} else if (moreAgendas.data) {
						setExtraAgendas(extraAgendas.concat(moreAgendas.data));
					} else {
						setOldAgendasError("An error occured while fetching your agendas");
					}
				}}
			>
				Load Past Agendas
				{loadingPastAgendas && <LoadingSmall className="ml-4" />}
			</Button>
			<p className="text-red-500">{oldAgendasError}</p>
		</div>
	);
};

import { Button } from "@/components/misc/button";
import { LoadingSmall } from "@/components/misc/loading";
import { fetchMoreAgendas } from "@/lib/db/classes";
import { Json } from "@/lib/db/database.types";
import supabase from "@/lib/supabase";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Agenda } from "./agenda";
import { CreateAgenda } from "./createAgenda";

export const AgendasModule = ({
	classID,
	agendas,
	allAssignments,
	isTeacher,
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
	isTeacher: boolean;
}) => {
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
						allAgendas.sort(
							(a, b) =>
								new Date(b.date!).getTime() - new Date(a.date!).getTime()
						)[0].date!,
						true
					);

					setLoadingFutureAgendas(false);
					if (moreAgendas.data) {
						setExtraAgendas(extraAgendas.concat(moreAgendas.data));
					}
				}}
			>
				Load Newer Agendas
				{loadingFutureAgendas && <LoadingSmall className="ml-4" />}
			</Button>
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
							allAssignments={allAssignments}
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
						allAgendas.sort(
							(a, b) =>
								new Date(a.date!).getTime() - new Date(b.date!).getTime() // sorting in reverse order for this
						)[0].date!,
						false
					);

					setLoadingPastAgendas(false);
					if (moreAgendas.data) {
						setExtraAgendas(extraAgendas.concat(moreAgendas.data));
					}
				}}
			>
				Load Past Agendas
				{loadingPastAgendas && <LoadingSmall className="ml-4" />}
			</Button>
		</div>
	);
};

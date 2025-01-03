import { SupabaseClient } from "@supabase/supabase-js";
import { Database, Json } from "./database.types";
import { getTheseAssignments } from "./assignments/assignments";
import { CoursifyFile } from "@/components/files/genericFileUpload";

export const fetchAgendasAndAssignments = async (
	supabase: SupabaseClient<Database>,
	classID: string,
	agendas: string[],
	assignments: string[], //we don't want to fetch any assignments that we don't need to
	date: string,
	fetchFuture: boolean
) => {
	const fetchedAgendas = await supabase
		.from("agendas")
		.select(`*`)
		.eq("class_id", classID)
		.filter("date", fetchFuture ? "gte" : "lte", date) // grr
		.not("id", "in", `(${agendas as string[]})`)
		.limit(10);
	let fetchedAssignments;
	if (fetchedAgendas.data) {
		fetchedAssignments = await getTheseAssignments(
			supabase,
			classID,
			fetchedAgendas.data.flatMap((agenda) =>
				// all assignments attached to a particular agenda
				agenda.assignments
					? agenda.assignments.filter(
							(assignment) =>
								// filter to make sure that this assignment was not already fetched
								assignments.indexOf(assignment) === -1
						)
					: []
			)
		);
	}
	return { fetchedAgendas, fetchedAssignments };
};

export const createAgenda = async (
	supabase: SupabaseClient<Database>,
	class_id: string,
	date: string,
	description: Json,
	assignments: string[],
	files: CoursifyFile[]
) => {
	const newFiles = await Promise.all(
		files.map(async (coursifyFile) => {
			if (coursifyFile.file) {
				await supabase.storage
					.from("ugc")
					.upload(`agendas/${coursifyFile.dbName}`, coursifyFile.file);
				const withLink = {
					...coursifyFile,
					link: `https://cdn.coursify.one/storage/v1/object/public/ugc/agendas/${coursifyFile.dbName}`,
				};
				const { file: _, ...withoutFile } = withLink;
				return withoutFile;
			}
		})
	);

	return await supabase
		.from("agendas")
		.insert({
			class_id,
			description,
			date,
			assignments,
			files: newFiles as unknown as Json[],
		})
		.select()
		.single();
};

export const deleteAgenda = async (
	supabase: SupabaseClient<Database>,
	id: string,
	associatedFiles: string[] | undefined
) => {
	if (associatedFiles) {
		await supabase.functions.invoke("delete-file", {
			body: {
				path: associatedFiles,
			},
		});
	}
	return await supabase.from(`agendas`).delete().eq("id", id).select().single();
};

export const editAgenda = async (
	supabase: SupabaseClient<Database>,
	id: string,
	newData: {
		date: string;
		description: Json;
		assignments: string[];
		files: CoursifyFile[];
	}
) => {
	const newFiles = await Promise.all(
		newData.files.map(async (coursifyFile) => {
			if (coursifyFile.file) {
				await supabase.storage
					.from("ugc")
					.upload(`agendas/${coursifyFile.dbName}`, coursifyFile.file);
				const withLink = {
					...coursifyFile,
					link: `https://cdn.coursify.one/storage/v1/object/public/ugc/agendas/${coursifyFile.dbName}`,
				};
				const { file: _, ...withoutFile } = withLink;
				return withoutFile;
			} else {
				return coursifyFile;
			}
		})
	);
	return await supabase
		.from("agendas")
		.update({
			date: newData.date,
			description: newData.description,
			assignments: newData.assignments,
			files: newFiles as unknown as Json[],
		})
		.eq("id", id)
		.select()
		.single();
};

export const searchDB = async (
	supabase: SupabaseClient<Database>,
	query: string,
	classID: string,
	excludeThese: string[] // we don't want to fetch assignments that we already fetched
) => {
	return await supabase
		.from("assignments")
		.select(
			`
        id,
        name,
        description,
        due_type,
        due_date
        `
		)
		.eq("class_id", classID)
		.not("id", "in", `(${excludeThese as string[]})`)
		.ilike("name", `%${query}%`)
		.limit(10);
};

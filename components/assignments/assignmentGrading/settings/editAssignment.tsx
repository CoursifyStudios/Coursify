import { Popup } from "@/components/misc/popup";
import { Tab } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction, useEffect } from "react";
import AssignmentSettings from "../../assignmentCreation/three";
import { TeacherAssignmentResponse } from "@/lib/db/assignments/assignments";
import { AssignmentSettingsTypes } from "../../assignmentCreation/three/settings.types";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database, Json } from "@/lib/db/database.types";
import AssignmentDetails, {
	AssignmentSaveData,
} from "../../assignmentCreation/two";
import { CoursifyFile } from "@/components/files/genericFileUpload";

const EditAssignment = ({
	close,
	open,
	assignment,
	setAssignment,
	supabase,
	setLoading,
	setError,
}: {
	open: boolean;
	close: () => void;
	assignment: TeacherAssignmentResponse;
	setAssignment: Dispatch<SetStateAction<TeacherAssignmentResponse>>;
	supabase: SupabaseClient<Database>;
	setLoading: Dispatch<SetStateAction<boolean>>;
	setError: Dispatch<SetStateAction<string>>;
}) => {
	const editSettings = async (settings: AssignmentSettingsTypes) => {
		if (JSON.stringify(assignment.data?.settings) == JSON.stringify(settings)) {
			close();
			return;
		}
		setLoading(true);
		setError("");
		const { error } = await supabase
			.from("assignments")
			.update({ settings: settings as unknown as Json })
			.eq("id", assignment.data?.id ?? "");

		if (error) {
			setError(error.message);
		} else {
			setAssignment((a) => {
				if (!a.data) return a;
				return {
					...a,
					data: {
						...a.data,
						settings: settings as unknown as Json,
					},
				};
			});
		}
		close();
		setLoading(false);
	};

	const editAssignment = async (assign: AssignmentSaveData) => {
		let updatedDetails = false;
		const {
			submissionInstructions: _,
			content: content,
			files: f,
			maxGrade,
			...scopedAssignment
		} = assign;

		// try to reduce the vast majority of the data transfer since the lexical json is massive
		if (JSON.stringify(content) != JSON.stringify(assignment.data?.content)) {
			updatedDetails = true;
		}
		setLoading(true);
		setError("");

		const toUpload: CoursifyFile[] = [];
		const toDelete: CoursifyFile[] = assignment.data!.files
			? (assignment.data!.files as unknown as CoursifyFile[]).filter((file) => {
					!f.some((f) => f.dbName == file.dbName);
				})
			: [];

		const files = f.map((file) => {
			if (
				assignment.data!.files &&
				!assignment.data!.files?.some(
					(f) => (f as unknown as CoursifyFile).dbName == file.dbName
				)
			) {
				toUpload.push(file);
			}
			const { file: _, ...returnF } = file;

			return {
				...returnF,
				link: `https://cdn.coursify.one/storage/v1/object/public/ugc/assignments/${file.dbName}`,
			};
		});
		// reyturning undefined, preumably the delete returniong doesn't work (copied from stack overflow)
		//console.log(files)

		const data = await Promise.all(
			(
				[
					supabase
						.from("assignments")
						.update({
							...scopedAssignment,
							submission_instructions: assign.submissionInstructions || null,
							...(updatedDetails ? { content } : {}),
							max_grade: maxGrade ?? null,
							files,
						})
						.eq("id", assignment.data?.id ?? ""),
				] as unknown as Promise<Partial<{ error: unknown }>>[]
			)
				.concat(
					toUpload.map(
						async (file) =>
							await supabase.storage
								.from("ugc")
								.upload(`assignments/${file.dbName}`, file.file!)
					)
				)

				.concat(
					toDelete.length > 0
						? [
								supabase.functions.invoke("delete-file", {
									body: {
										path: toDelete.map((file) => `assignments/${file.dbName}`),
									},
								}),
							]
						: []
				)
		);

		const errors = data.filter((d) => d.error);

		if (errors.length > 0) {
			setError("An error occurred");
		} else {
			setAssignment((a) => {
				if (!a.data) return a;
				return {
					...a,
					data: {
						...a.data,
						...scopedAssignment,
						submission_instructions: assign.submissionInstructions || null,
						files: files as unknown as Json[],
						max_grade: maxGrade ?? null,
						content,
					},
				};
			});
		}
		close();
		setLoading(false);
	};

	return (
		<Popup open={open} closeMenu={close}>
			<Tab.Group as="div" className="flex grow flex-col">
				<Tab.List as="div" className=" mb-4 flex max-sm:space-x-2 sm:space-x-6">
					<Tab as={Fragment}>
						{({ selected }) => (
							<div
								tabIndex={0}
								className={`flex cursor-pointer items-center rounded-lg border px-2.5  focus:outline-none ${
									selected
										? "brightness-focus"
										: "border-transparent bg-gray-200"
								} text-lg font-semibold`}
							>
								Assignment Details
							</div>
						)}
					</Tab>
					<Tab as={Fragment}>
						{({ selected }) => (
							<div
								tabIndex={0}
								className={`flex cursor-pointer items-center rounded-lg border px-2.5  focus:outline-none ${
									selected
										? "brightness-focus"
										: "border-transparent bg-gray-200"
								} text-lg font-semibold`}
							>
								Submission Settings
							</div>
						)}
					</Tab>
				</Tab.List>
				<Tab.Panels>
					<Tab.Panel>
						<AssignmentDetails
							stage={2}
							customAssignment={assignment.data}
							save={editAssignment}
						/>
					</Tab.Panel>
					<Tab.Panel>
						<AssignmentSettings
							stage={3}
							useCustomSettings={true}
							save={editSettings}
							customSettings={
								assignment.data?.settings as unknown as AssignmentSettingsTypes
							}
							assignmentType={assignment.data?.type}
						/>
					</Tab.Panel>
				</Tab.Panels>
			</Tab.Group>
		</Popup>
	);
};

export default EditAssignment;

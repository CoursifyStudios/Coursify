import Avatar from "@/components/misc/avatar";
import { ColoredPill } from "@/components/misc/pill";
import { TeacherAssignment } from "@/lib/db/assignments/assignments";
import { ArrayElementType } from "@/lib/misc/elementarraytype.types";
import { Disclosure } from "@headlessui/react";
import { Dispatch, SetStateAction } from "react";

const StudentSelector = ({
	graded,
	maxGrade,
	notSubmitted,
	ungraded,
	selectedID,
	totalStudents,
	setSelectedID,
}: StudentSelectorTypes) => {
	return (
		<div className="flex w-64 min-w-[16rem] my-2 mt-4 flex-col">
			<div className=" rounded-xl flex space-y-2 flex-col">
				<Disclosure defaultOpen>
					{({ open }) => (
						<>
							<Disclosure.Button className="flex rounded-lg items-center bg-gray-200 px-4 py-1.5 text-left text-sm font-medium">
								<span>Ungraded</span>
								<ColoredPill color="gray" className="ml-auto">
									{ungraded.length}
								</ColoredPill>
							</Disclosure.Button>
							<Disclosure.Panel className=" pt-2 pb-4 text-sm flex flex-col  gap-2">
								{ungraded.length != 0 ? (
									ungraded.map((student) => (
										<User
											key={student.id}
											student={student}
											type={UserType.SUBMITTED}
										/>
									))
								) : (
									<p className="font-medium text-center">
										You{"'"}ve graded all submissions!
									</p>
								)}
							</Disclosure.Panel>
						</>
					)}
				</Disclosure>
				<Disclosure defaultOpen>
					{({ open }) => (
						<>
							<Disclosure.Button className="flex rounded-lg items-center bg-gray-200 px-4 py-1.5 text-left text-sm font-medium">
								<span>Not Submitted</span>
								<ColoredPill color="gray" className="ml-auto">
									{notSubmitted.length}
								</ColoredPill>
							</Disclosure.Button>
							<Disclosure.Panel className=" pt-2 pb-4 text-sm flex flex-col gap-2">
								{notSubmitted.length != 0 ? (
									notSubmitted.map((student) => (
										<User
											key={student.id}
											student={student}
											type={
												student.submissions.length != 0
													? UserType.DRAFT
													: UserType.NORMAL
											}
										/>
									))
								) : (
									<p className="font-medium text-center">
										All students have submitted!
									</p>
								)}
							</Disclosure.Panel>
						</>
					)}
				</Disclosure>
				<Disclosure defaultOpen>
					{({ open }) => (
						<>
							<Disclosure.Button className="flex rounded-lg items-center bg-gray-200 px-4 py-1.5 text-left text-sm font-medium">
								<span>{maxGrade == null ? "Reviewed" : "Graded"} </span>
								<ColoredPill color="gray" className="ml-auto">
									{graded.length}/{totalStudents}
								</ColoredPill>
							</Disclosure.Button>
							<Disclosure.Panel className=" pt-2 pb-4 text-sm flex flex-col  gap-2">
								{graded.length != 0 ? (
									graded.map((student) => (
										<User
											key={student.id}
											student={student}
											type={UserType.GRADED}
										/>
									))
								) : (
									<p className="font-medium text-center">
										You haven{"'"}t graded any submissions yet!
									</p>
								)}
							</Disclosure.Panel>
						</>
					)}
				</Disclosure>
			</div>
		</div>
	);

	function User({ student, type }: { student: Student; type: UserType }) {
		return (
			<button
				key={student.id}
				className={`p-3 bg-backdrop-200 rounded-xl flex items-center text-left ${
					selectedID == student.id && "brightness-focus"
				} ${type != UserType.NORMAL && "brightness-hover"}`}
				onClick={() => setSelectedID(student.id)}
				disabled={type == UserType.NORMAL}
			>
				<Avatar
					full_name={student.full_name}
					avatar_url={student.avatar_url}
					size="10"
				/>
				<div className="ml-3">
					<p className="font-medium">{student.full_name}</p>
					<p className="text-xs">
						{type == UserType.SUBMITTED &&
							new Intl.DateTimeFormat("en-US", {
								month: "2-digit",
								day: "2-digit",
								year: "numeric",
								hour: "numeric",
								minute: "numeric",
							}).format(
								new Date(
									student.submissions.find((s) => s.final)?.created_at || ""
								)
							)}
						{type == UserType.DRAFT && "Draft submitted"}
						{type == UserType.GRADED && maxGrade && (
							<>
								Grade: {student.submissions.find((s) => s.final)?.grade}/
								{maxGrade}
							</>
						)}
					</p>
				</div>
			</button>
		);
	}
};

export default StudentSelector;

enum UserType {
	NORMAL = 0,
	DRAFT = 1,
	SUBMITTED = 2,
	GRADED = 3,
}

interface StudentSelectorTypes {
	ungraded: Student[];
	notSubmitted: Student[];
	graded: Student[];
	maxGrade: number | null;
	totalStudents: number;
	selectedID: string | undefined;
	setSelectedID: Dispatch<SetStateAction<string | undefined>>;
}

export type Student = ArrayElementType<TeacherAssignment["users"]>;

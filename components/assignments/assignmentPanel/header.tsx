import { ButtonIcon } from "@/components/misc/button";
import { ColoredPill, CopiedHover } from "@/components/misc/pill";
import {
	ArrowsPointingInIcon,
	ArrowsPointingOutIcon,
	CalendarDaysIcon,
	ChevronDownIcon,
	ChevronLeftIcon,
	Cog6ToothIcon,
	LinkIcon,
	PencilSquareIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";
import { NextPage } from "next";
import Link from "next/link";
import { Dispatch, ReactNode, SetStateAction, useMemo } from "react";
import { submissionType } from "../assignmentCreation/submissionType";
import {
	StudentAssignmentResponse,
	TeacherAssignmentResponse,
} from "@/lib/db/assignments/assignments";
import MenuSelect from "@/components/misc/menu";
import Loading from "@/components/misc/loading";
import dynamic from "next/dynamic";
import { formatDate } from "@/lib/misc/dates";

const Editor = dynamic(() => import("../../editors/richeditor"));

const AssignmentHeader: NextPage<{
	setEditOpen?: Dispatch<SetStateAction<boolean>>;
	setDatesOpen?: Dispatch<SetStateAction<boolean>>;
	loading?: boolean;
	error?: string;
	assignment: StudentAssignmentResponse | TeacherAssignmentResponse;
	fullscreen: boolean;
	setFullscreen: Dispatch<SetStateAction<boolean>>;
	teacher?: boolean;
	deleteAssignment?: () => void;
	hideAssignment?: MenuElement;
	publishAssignment?: MenuElement;
}> = ({
	assignment,
	fullscreen,
	setFullscreen,
	teacher,
	deleteAssignment,
	error,
	loading = false,
	setDatesOpen,
	setEditOpen,
	hideAssignment,
	publishAssignment,
}) => {
	if (!assignment.data) return null;

	const type = submissionType.find(
		(type) => type.type == assignment.data.type
	)!;
	return (
		<section className="">
			<div className="grow">
				<Link
					className=" md:hidden"
					href="/assignments/0"
					onClick={() => setFullscreen(false)}
				>
					<ButtonIcon
						icon={<ChevronLeftIcon className="h-5 w-5" />}
						className="mb-4"
					/>
				</Link>
				<div className="flex gap-2  items-center">
					<div className="flex justify-between gap-3 items-center ">
						<Link
							href={
								"/classes/" +
								(Array.isArray(assignment.data.classes)
									? assignment.data.classes[0].id
									: assignment.data.classes?.id)
							}
						>
							<ColoredPill
								color={
									assignment.data.classes
										? Array.isArray(assignment.data.classes)
											? assignment.data.classes[0].color
											: assignment.data.classes?.color
										: "blue"
								}
								hoverState
								className="max-w-[15rem] truncate"
							>
								{assignment.data.classes
									? Array.isArray(assignment.data.classes)
										? assignment.data.classes[0].name
										: assignment.data.classes.name
									: "Error fetching class"}
							</ColoredPill>
						</Link>
						<ColoredPill color="gray" className="flex gap-2">
							{type.icon}
							{type.name}
						</ColoredPill>
						{teacher && (
							<ColoredPill color="gray" className="flex gap-2">
								{assignment.data.hidden
									? "Hidden from students"
									: new Date(assignment.data.publish_date!).getTime() >
										  new Date().getTime()
										? `Publishes on ${formatDate(
												new Date(assignment.data.publish_date)
											)}`
										: assignment.data.due_date
											? `Due ${formatDate(new Date(assignment.data.due_date))}`
											: `Published on ${formatDate(
													new Date(assignment.data.publish_date)
												)}`}
							</ColoredPill>
						)}
					</div>
					<div className="ml-auto flex items-center">
						{loading && <Loading />}
						{error && <p className="text-red-500">Error: {error}</p>}
					</div>
					<div className="flex md:space-x-4">
						{teacher && setEditOpen && setDatesOpen && hideAssignment && (
							<MenuSelect
								items={[
									{
										content: (
											<>
												Edit
												<PencilSquareIcon className="w-5 h-5 ml-auto" />
											</>
										),
										onClick: () => setEditOpen(true),
									},
									{
										content: (
											<>
												Update Dates
												<CalendarDaysIcon className="w-5 h-5 ml-auto" />
											</>
										),
										onClick: () => setDatesOpen(true),
									},
									hideAssignment,
									publishAssignment,
									{
										content: (
											<>
												Delete
												<TrashIcon className="w-5 h-5 ml-auto" />
											</>
										),
										className: "flex grow bg-red-500/25 hover:bg-red-500/40",
										onClick: deleteAssignment,
									},
								]}
							>
								<ButtonIcon icon={<Cog6ToothIcon className="h-5 w-5" />} />
							</MenuSelect>
						)}
						<CopiedHover copy={window.location.href}>
							<ButtonIcon icon={<LinkIcon className="h-5 w-5" />} />
						</CopiedHover>
						<div onClick={() => setFullscreen(!fullscreen)}>
							<ButtonIcon
								icon={
									fullscreen ? (
										<ArrowsPointingInIcon className="h-5 w-5" />
									) : (
										<ArrowsPointingOutIcon className="h-5 w-5" />
									)
								}
								className="hidden items-center justify-center md:flex"
							/>
						</div>
					</div>
				</div>
				<div className="mt-4 rounded-xl bg-gray-200 p-4 ">
					<h1 className="title mb-0.5 line-clamp-2">{assignment.data.name}</h1>
					<p className="truncate text-gray-700 text-sm">
						{assignment.data.description}
					</p>
					{assignment.data.content && teacher && (
						<button className="group w-full relative p-1">
							<div className="inset-0 absolute bg-gradient-to-b from-transparent to-gray-200 z-20 flex flex-col justify-end font-medium items-center backdrop-blur-[2px] group-focus:hidden">
								Tap to see assignment details
								<ChevronDownIcon className="w-5 h-5" />
							</div>
							<div className="overflow-hidden max-h-10 group-focus:max-h-none">
								<Editor
									editable={false}
									initialState={assignment.data.content}
									className="border border-gray-300 group-focus:border-transparent rounded-xl px-1"
								/>
							</div>
						</button>
					)}
				</div>
			</div>
		</section>
	);
};

export default AssignmentHeader;

type MenuElement =
	| {
			content: ReactNode;
			onClick?: (() => void) | undefined;
			link?: string | undefined;
			className?: string | undefined;
	  }
	| undefined;

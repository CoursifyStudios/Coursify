import {
	ArrowsPointingInIcon,
	ArrowsPointingOutIcon,
	ArrowTopRightOnSquareIcon,
	CheckIcon,
	ChevronLeftIcon,
	LinkIcon,
} from "@heroicons/react/24/outline";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Starred from "../../components/misc/starred";
import Image from "next/image";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import {
	AllAssignmentResponse,
	AssignmentResponse,
	getAllAssignments,
	getAssignment,
} from "../../lib/db/assignments";
import { Database } from "../../lib/db/database.types";
import launch from "../../public/svgs/launch.svg";
import noData from "../../public/svgs/no-data.svg";
import Link from "next/link";
import { ColoredPill } from "../../components/misc/pill";
import { ButtonIcon } from "../../components/misc/button";

const Post: NextPage = () => {
	const supabaseClient = useSupabaseClient<Database>();
	const [allAssignments, setAllAssignments] = useState<AllAssignmentResponse>();
	const [assignment, setAssignment] = useState<AssignmentResponse>();
	const router = useRouter();
	const user = useUser();
	const { assignmentid } = router.query;
	const [fullscreen, setFullscreen] = useState(false);

	useEffect(() => {
		(async () => {
			if (user) {
				const all = await getAllAssignments(supabaseClient);
				setAllAssignments(all);
			}
		})();

		(async () => {
			if (
				user &&
				router.isReady &&
				typeof assignmentid == "string" &&
				assignmentid != "0"
			) {
				const assignment = await getAssignment(supabaseClient, assignmentid);
				setAssignment(assignment);
			}
		})();
		if (router.isReady && assignmentid != "0" && window.innerWidth < 768) {
			setFullscreen(true);
		}
	}, [user, supabaseClient, router, assignmentid]);

	return (
		<div className="mx-auto flex w-full max-w-screen-xl px-5 pt-6 pb-6">
			<div
				className={`scrollbar-fancy mr-4 grow items-center overflow-x-clip md:grow-0 ${
					fullscreen ? "hidden" : "flex"
				} w-[20.5rem] shrink-0 snap-y snap-mandatory flex-col space-y-8 overflow-y-auto md:h-[calc(100vh-6.5rem)] `}
			>
				{allAssignments ? (
					!allAssignments.error &&
					allAssignments.data.map((assignment) => (
						<AssignmentPreview
							name={assignment.name}
							desc={assignment.description}
							starred={false}
							due={new Date(1667840443856)}
							id={assignment.id}
							classes={
								assignment.classes
									? Array.isArray(assignment.classes)
										? assignment.classes[0]
										: assignment.classes
									: undefined
							}
							key={assignment.id}
						/>
					))
				) : (
					<>
						{[...Array(3)].map((_, i) => (
							<div
								className="h-24 animate-pulse rounded-xl bg-gray-200 "
								key={i}
							></div>
						))}
					</>
				)}
			</div>
			<div
				className={`grow rounded-xl bg-gray-200 p-4 md:h-[calc(100vh-6.5rem)] md:p-6 ${
					fullscreen ? "flex" : "hidden md:flex"
				}`}
			>
				<AssignmentPane />
			</div>
		</div>
	);

	function AssignmentPane() {
		const [copied, setCopied] = useState(false);
		const [copiedHover, setCopiedHover] = useState(false);

		if (
			!router.isReady ||
			!allAssignments ||
			(!assignment && assignmentid != "0")
		) {
			return (
				<div className="m-auto flex flex-col items-center">
					Loading... (need loadiung animations and stuff)sss
				</div>
			);
		}

		if (assignmentid == "0") {
			return (
				<div className="m-auto flex flex-col items-center">
					<Image
						src={launch}
						alt="Nothing present icon"
						width={150}
						height={150}
					/>
					<h1 className=" mt-4 max-w-xs text-center font-semibold">
						Click an assignment on the left pane to get started
					</h1>
				</div>
			);
		}

		if (assignment?.error) {
			return (
				<div className="m-auto flex flex-col items-center">
					<Image
						src={noData}
						alt="Nothing present icon"
						width={150}
						height={150}
					/>
					<h1 className=" mt-4 max-w-xs text-center font-semibold">
						This assignment doesn{"'"}t exist (or you don{"'"}t have access to
						it)
					</h1>
				</div>
			);
		}

		if (assignment?.data) {
			return (
				<div className="flex grow flex-col">
					<section className="flex items-start justify-between">
						<div className="mr-4 lg:max-w-lg xl:max-w-xl">
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
							<ColoredPill color="blue">
								{assignment.data.classes
									? Array.isArray(assignment.data.classes)
										? assignment.data.classes[0].name
										: assignment.data.classes.name
									: "Error fetching class"}
							</ColoredPill>

							<h1 className="title mt-4 mb-2 line-clamp-2">
								{assignment.data.name}
							</h1>
							<p className="text-gray-700 line-clamp-2">
								{assignment.data.description}
							</p>
						</div>
						<div className="flex md:space-x-4">
							<div
								className="group relative"
								onClick={() => (
									navigator.clipboard.writeText(window.location.href),
									setCopied(true),
									setTimeout(() => {
										//Show for 700 seconds until exiting hover thing
										setCopiedHover(false);
										setTimeout(() => {
											//Change text back once scale animation is over
											setCopied(false);
										}, 150);
									}, 700)
								)}
								onMouseEnter={() => setCopiedHover(true)}
								onMouseLeave={() => setCopiedHover(false)}
							>
								<ButtonIcon icon={<LinkIcon className="h-5 w-5" />} />
								<div
									className={`absolute mt-2 w-24 -translate-x-8 scale-0 rounded transition-all ${
										copied ? "bg-green-50" : "bg-gray-50"
									} px-2  py-0.5 text-center text-sm font-medium shadow-lg transition ${
										copiedHover && "scale-100"
									}`}
								>
									{copied ? "Copied!" : "Copy Link"}
								</div>
							</div>
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
					</section>
					<section className="scrollbar-fancy relative mt-8 flex flex-1 flex-col-reverse overflow-y-scroll whitespace-pre-line md:pr-2 xl:flex-row">
						<div className="flex grow flex-col">
							<h2 className="mb-2 text-xl font-semibold">Assignment</h2>
							{assignment.data.content}
						</div>
						<div className="sticky mb-8 flex shrink-0 flex-col overflow-y-auto xl:top-0 xl:ml-4 xl:mb-0 xl:w-72">
							<h2 className="text-xl font-semibold">Submission</h2>
							<div className="mt-2 rounded-xl bg-gray-300 p-6">
								<h2 className="text-lg font-semibold ">
									Teachers Instructions:
								</h2>
								<p className="max-w-md text-sm text-gray-700">
									Teachers instructions for assignment submission will go in
									this place
								</p>
								<div className="mt-6 inline-flex rounded-md bg-blue-500 px-4 py-1 font-semibold text-white">
									Submit Link
								</div>
							</div>
						</div>
					</section>
				</div>
			);
		}

		return <div>An unknown error occured. Assignment id: {assignmentid}</div>;
	}

	function AssignmentPreview(props: {
		name: string;
		desc: string;
		starred: boolean;
		due: Date;
		id: string;
		classes?: {
			id: string;
			name: string;
			description: string;
			block: number | null;
		};
	}) {
		return (
			<Link
				className={`flex h-max snap-start rounded-xl ${
					assignmentid == props.id ? "bg-gray-50 shadow-xl" : "bg-gray-200"
				} p-3`}
				href={"/assignments/" + props.id}
			>
				<div className="w-10">
					<Starred starred={props.starred} />
				</div>
				<div>
					<ColoredPill color="blue">
						{props.classes?.name || "Error fetching class"}
					</ColoredPill>
					<h1 className="text font-medium">{props.name}</h1>
					<p className="w-[12rem] break-words line-clamp-3  ">{props.desc}</p>
				</div>
				<div className="ml-1 flex flex-col items-end justify-between">
					<p className="w-max text-sm font-medium text-gray-700">
						Due: {props.due.getMonth() + 1}/{props.due.getDate()}
					</p>
					<CheckIcon className="h-5 w-5 text-gray-600" />
				</div>
			</Link>
		);
	}
};

export default Post;

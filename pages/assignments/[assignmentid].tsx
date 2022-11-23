import { CheckIcon } from "@heroicons/react/24/outline";
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

const Post: NextPage = () => {
	const supabaseClient = useSupabaseClient<Database>();
	const [allAssignments, setAllAssignments] = useState<AllAssignmentResponse>();
	const [assignment, setAssignment] = useState<AssignmentResponse>();
	const router = useRouter();
	const user = useUser();
	const { assignmentid } = router.query;
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
				Number.parseInt(assignmentid) != 0
			) {
				const assignment = await getAssignment(
					supabaseClient,
					Number.parseInt(assignmentid)
				);
				setAssignment(assignment);
			}
		})();
	}, [user, supabaseClient, router]);

	return (
		<div className="mx-auto flex w-full max-w-screen-xl px-5 pt-5 pb-4">
			<div className="scrollbar-fancy mr-4 flex h-[calc(100vh-6rem)] w-80 snap-y snap-mandatory flex-col space-y-8 overflow-y-auto ">
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
					<div>Loading...</div>
				)}
			</div>
			<div className="flex flex-grow rounded-xl bg-gray-200 p-6">
				<AssignmentPane />
			</div>
		</div>
	);

	function AssignmentPane() {
		if (
			!router.isReady ||
			!allAssignments ||
			(!assignment && Number.parseInt(assignmentid as string) != 0)
		) {
			return (
				<div className="m-auto flex flex-col items-center">
					Loading... (need loadiung animations and stuff)sss
				</div>
			);
		}

		if (Number.parseInt(assignmentid as string) == 0) {
			return (
				<div className="m-auto flex flex-col items-center">
					<Image
						src={launch}
						alt="Nothing present icon"
						width={150}
						height={150}
					/>
					<h2 className=" mt-4 max-w-xs text-center font-semibold">
						Click an assignment on the left pane to get started
					</h2>
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
					<h2 className=" mt-4 max-w-xs text-center font-semibold">
						This assignment doesn{"'"}t exist (or you don{"'"}t have access to
						it)
					</h2>
				</div>
			);
		}

		if (assignment?.data) {
			return (
				<div>
					<section className="flex justify-between">
						<div>
							<ColoredPill color="blue">
								{assignment.data.classes
									? Array.isArray(assignment.data.classes)
										? assignment.data.classes[0].name
										: assignment.data.classes.name
									: "Error fetching class"}
							</ColoredPill>
							<h1 className="title mt-4">{assignment.data.name}</h1>
						</div>
						<div></div>
					</section>
					<section>
						<div></div>
						<div></div>
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
		id: number;
		classes?: {
			id: number;
			name: string;
			description: string;
			block: number | null;
		};
	}) {
		return (
			<Link
				className={`flex snap-start rounded-xl ${
					Number.parseInt(assignmentid as string) == props.id
						? "bg-gray-50 shadow-xl"
						: "bg-gray-200"
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
					<h2 className="text font-medium">{props.name}</h2>
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

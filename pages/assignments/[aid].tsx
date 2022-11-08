import { CheckIcon } from "@heroicons/react/24/outline";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import Starred from "../../components/misc/starred";
import Image from "next/image";

const Post: NextPage = () => {
	const [data, setData] = useState();
	const router = useRouter();
	const { aid } = router.query;

	return (
		<div className="mx-auto flex w-full max-w-screen-xl px-5 pt-5 pb-4">
			<div className="scrollbar-fancy mr-4 flex h-[calc(100vh-6rem)] w-80 snap-y snap-mandatory flex-col space-y-4 overflow-y-auto ">
				<AssignmentPreview
					name="test"
					desc="description for assignmentsssssssssssssssssss with more words ok so I can test this"
					starred={true}
					due={new Date(1667840443856)}
					id={1}
				/>
				<AssignmentPreview
					name="test"
					desc="words"
					starred={true}
					due={new Date(1667840443856)}
					id={2}
				/>
				<AssignmentPreview
					name="test"
					desc="words"
					starred={true}
					due={new Date(1667840443856)}
					id={3}
				/>
				<AssignmentPreview
					name="test"
					desc="words"
					starred={true}
					due={new Date(1667840443856)}
					id={4}
				/>
				<AssignmentPreview
					name="test"
					desc="words"
					starred={true}
					due={new Date(1667840443856)}
					id={5}
				/>
				<AssignmentPreview
					name="test"
					desc="words"
					starred={true}
					due={new Date(1667840443856)}
					id={6}
				/>
				<AssignmentPreview
					name="test"
					desc="words"
					starred={true}
					due={new Date(1667840443856)}
					id={7}
				/>
				<AssignmentPreview
					name="test"
					desc="words"
					starred={true}
					due={new Date(1667840443856)}
					id={8}
				/>
				<AssignmentPreview
					name="test"
					desc="words"
					starred={true}
					due={new Date(1667840443856)}
					id={9}
				/>
			</div>
			<div className="flex flex-grow  rounded-xl bg-gray-200">
				<AssignmentPane />
			</div>
		</div>
	);

	function AssignmentPane() {
		if (!router.isReady || (!data && Number.parseInt(aid as string) != 0)) {
			return (
				<div className="m-auto flex flex-col items-center">
					Loading... (need icons and stuff)
				</div>
			);
		}

		if (Number.parseInt(aid as string) == 0) {
			return (
				<div className="m-auto flex flex-col items-center">
					<Image
						src="/svgs/launch.svg"
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

		return <div>Assignment {aid}</div>;
	}

	function AssignmentPreview(props: {
		name: string;
		desc: string;
		starred: boolean;
		due: Date;
		id: number;
	}) {
		return (
			<div
				className={`flex snap-start rounded-md ${
					Number.parseInt(aid as string) == props.id
						? "bg-gray-50 shadow-lg"
						: "bg-gray-200"
				} p-3`}
			>
				<div className="w-10">
					<Starred starred={props.starred} />
				</div>
				<div>
					<h2 className="text-lg font-medium">{props.name}</h2>
					<p className="w-[12rem] break-words line-clamp-3  ">{props.desc}</p>
				</div>
				<div className="flex flex-col items-end justify-between">
					<p className="text-sm font-medium text-gray-700">
						Due: {props.due.getMonth() + 1}/{props.due.getDate()}
					</p>
					<CheckIcon className="h-5 w-5 text-gray-600" />
				</div>
			</div>
		);
	}
};

export default Post;

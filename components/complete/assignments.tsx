import { CheckIcon } from "@heroicons/react/24/outline";
import type { SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";
import { use, useState } from "react";
import { handleStarred } from "../../lib/db/assignments";
import { Database } from "../../lib/db/database.types";
import { ColoredPill } from "../misc/pill";
import Starred from "../misc/starred";

export function AssignmentPreview(props: {
	supabase: SupabaseClient<Database>;
	name: string;
	desc: string;
	starred: boolean;
	due: Date;
	userId: string;
	id: string;
	classes?: {
		id: string;
		name: string;
		color: string;
	};
}) {
	const [starred, setStarred] = useState(props.starred);
	const [dbStarred, setDbStarred] = useState(props.starred);

	const dealWithStarred = async () => {
		const newStarred = await handleStarred(
			props.supabase,
			starred,
			props.starred,
			props.id,
			props.userId
		);
		setDbStarred(newStarred);
	};

	return (
		<>
			<div className="w-10" onMouseLeave={() => dealWithStarred()}>
				<span onClick={() => setStarred((starred) => !starred)}>
					<Starred starred={starred} />
				</span>
			</div>
			<div>
				<Link href={"/classes/" + props.classes?.id}>
					{props.classes && (
						<ColoredPill color={props.classes.color} hoverState>
							{props.classes.name}
						</ColoredPill>
					)}
				</Link>
				<h1 className="text font-medium">{props.name}</h1>
				<p className="w-[12rem] break-words line-clamp-3  ">{props.desc}</p>
			</div>
			<div className="ml-1 flex flex-col items-end justify-between">
				<p className="w-max text-sm font-medium text-gray-700">
					Due: {props.due.getMonth() + 1}/{props.due.getDate()}
				</p>
				<CheckIcon className="h-5 w-5 text-gray-600" />
			</div>
		</>
	);
}

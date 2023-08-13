import { EnvelopeIcon, IdentificationIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useTabs } from "../../lib/tabs/handleTabs";
import { ColoredPill, CopiedHover } from "../misc/pill";
import Avatar from "../misc/avatar";

export const Member = ({
	user,
	teacher,
}: {
	user: {
		id: string;
		full_name: string;
		avatar_url: string;
		email: string | null;
	};
	teacher: boolean;
}) => {
	const { newTab } = useTabs();
	return (
		<div className="w-full relative">
			<Link
				className="w-full brightness-hover flex items-center rounded-xl bg-gray-200 p-3"
				key={user.id}
				href={"/profile/" + user.id}
				onClick={() =>
					newTab(
						"/profile/" + user.id,
						user.full_name.split(" ")[0] + "'s Profile"
					)
				}
			>
				<div className="w-full relative">
					<Avatar
						full_name={user.full_name}
						size="10"
						avatar_url={user.avatar_url}
						className="w-full min-w-[2.5rem]"
					/>
					{teacher && (
						<div className="w-full absolute -bottom-1 -right-0.5 flex rounded-full bg-yellow-100 p-0.5">
							<IdentificationIcon className="w-full h-4 w-4 text-yellow-600" />
						</div>
					)}
				</div>
				<div className="w-full ml-3">
					<h2 className="w-full mb-1 font-medium">{user.full_name}</h2>
					<p className="w-full px-2.5 py-0.5 invisible">placeholder</p>
				</div>
			</Link>
			<div className="w-full absolute bottom-4 left-16 ">
				<CopiedHover
					copy={user.email ?? "No email found"}
					customText="Copy Email"
				>
					<ColoredPill color="gray">
						<div className="w-full flex items-center lg:w-52 xl:w-44 max-w-max">
							<EnvelopeIcon className="w-full mr-1.5 h-4 w-4 text-gray-800" />
							<p className="w-full truncate">{user.email}</p>
						</div>
					</ColoredPill>
				</CopiedHover>
			</div>
		</div>
	);
};

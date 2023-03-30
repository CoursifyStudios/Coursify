import {
	EnvelopeIcon,
	IdentificationIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useTabs } from "../../lib/tabs/handleTabs";
import { ColoredPill, CopiedHover } from "../misc/pill";

export const Member = ({
	user,
	leader,
}: {
	user: {
		id: string;
		full_name: string;
		avatar_url: string;
		email: string | null;
	};
	leader: boolean;
}) => {
	const { newTab } = useTabs();
	return (
		<Link
			className="brightness-hover flex rounded-xl bg-gray-200 p-6"
			key={user.id}
			href={"/profile/" + user.id}
			onClick={() =>
				newTab(
					"/profile/" + user.id,
					user.full_name.split(" ")[0] + "'s Profile"
				)
			}
		>
			<div className="relative h-max">
				<img
					src={user.avatar_url!}
					alt="Profile picture"
					referrerPolicy="no-referrer"
					className=" h-10 rounded-full shadow-md shadow-black/25"
				/>
				{leader && (
					<div className="absolute -bottom-1 -right-1  flex rounded-full bg-yellow-100 p-0.5">
						<IdentificationIcon className="h-4 w-4 text-yellow-600" />
					</div>
				)}
			</div>
			<div className="ml-4 flex flex-col">
				<h2 className="mb-1 font-medium">{user.full_name}</h2>
				<CopiedHover copy={user.email ?? "No email found"}>
					<ColoredPill color="gray">
						<div className="flex items-center">
							<EnvelopeIcon className="mr-1.5 h-4 w-4 text-gray-800" />
							{user.email &&
								user.email.slice(0, 20) +
									(user.email?.length > 20 ? "..." : "")}
						</div>
					</ColoredPill>
				</CopiedHover>
			</div>
		</Link>
	);
};

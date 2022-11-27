import { useUser } from "@supabase/auth-helpers-react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import {
	CalendarIcon,
	MagnifyingGlassIcon,
	MegaphoneIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextComponentType } from "next";
import { useTabs } from "../../lib/tabs/handleTabs";
import supabase from "../../lib/supabase";
import { ButtonIcon } from "../misc/pill";

const Navbar: NextComponentType = () => {
	const { newTab, closeTab, tabs } = useTabs();
	const router = useRouter();
	const user = useUser();
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => setHydrated(true), []);

	if (router.isReady && hydrated && router.asPath.startsWith("/login")) {
		return null;
	}

	return (
		<nav className="flex h-14 items-center justify-between bg-gray-200 px-8">
			<div className="scrollbar-fancy flex shrink items-center space-x-4 overflow-x-auto">
				{defaultTabs.map((v, i) => (
					<TabUI key={i} canClose={false} tab={v} />
				))}
				<div className="graydient h-10 w-[0.07rem] "></div>
				{tabs.map(
					(v, i) => hydrated && <TabUI key={i} canClose={true} tab={v} />
				)}
			</div>
			<div className="flex w-72 grow flex-row-reverse items-center space-x-4 space-x-reverse">
				{user ? (
					<img
						src={user.user_metadata.picture}
						alt="Profile picture"
						referrerPolicy="no-referrer"
						className="!ml-2 h-10 rounded-full shadow-md shadow-black/25"
					/>
				) : (
					<div className="!ml-2 h-10 w-10 rounded-full bg-gray-300"></div>
				)}
				<ButtonIcon
					icon={<MegaphoneIcon className="h-5 w-5" />}
					to="/announcements"
				/>
				<ButtonIcon
					icon={<CalendarIcon className="h-5 w-5" />}
					to="/calendar"
				/>
				<ButtonIcon icon={<MagnifyingGlassIcon className=" h-5 w-5 grow" />} />
			</div>
		</nav>
	);

	function TabUI({ tab, canClose }: { tab: Tab; canClose: boolean }) {
		const selected = useMemo(() => router.pathname.match(tab.matcher), [tab]);

		return (
			<div
				className={`my-1.5 mx-1 flex items-center rounded-md ${
					selected ? "bg-gray-50 shadow-md  " : "bg-gray-300"
				} ${canClose && "pr-3"} text-lg font-semibold `}
			>
				<Link href={tab.route}>
					<div
						className={`max-w-[10rem] truncate py-0.5  ${
							canClose ? "pl-3" : "px-3"
						}`}
					>
						{tab.name}
					</div>
				</Link>
				{canClose && (
					<XMarkIcon
						onClick={(e) => (
							e.stopPropagation(), handleClose(tab.name, selected)
						)}
						// apparently stop propigation doesn't work with nextjs links.
						// I could use router.push(), but then we would have to be in charge of preloading pages
						// I decicded to instead just make the text the link. It not great but is just works:tm:
						// - Lukas
						className={`ml-2 h-5 w-5 rounded-sm  text-gray-500 transition hover:text-gray-800
									 ${selected ? "hover:bg-gray-100" : "hover:bg-gray-400/20"}`}
					/>
				)}
			</div>
		);
	}

	function handleClose(name: string, selected: RegExpMatchArray | null) {
		closeTab(name);
		if (selected) {
			router.push("/");
		}
	}
};

export interface Tab {
	//this is temp (not), see the tabs rfc here for the proposal: https://docs.google.com/document/d/1oAc1VBBhF7aVSQeesqvNN4Wb8J4m-aJBoMPG1vLyVZs/edit
	name: string;
	route: string;
	matcher: RegExp;
}

const defaultTabs: Tab[] = [
	{
		name: "Home",
		route: "/",
		matcher: /^\/$|^$/g,
	},
	{
		name: "Assignments",
		route: "/assignments/0",
		matcher: /^\/assignments/g,
	},
];

export default Navbar;

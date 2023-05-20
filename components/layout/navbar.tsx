import { Menu, Transition } from "@headlessui/react";
import {
	ArrowLeftOnRectangleIcon,
	CalendarDaysIcon,
	Cog6ToothIcon,
	MagnifyingGlassIcon,
	MegaphoneIcon,
	UserGroupIcon,
	UserIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { NextComponentType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Database } from "../../lib/db/database.types";
import { useTabs } from "../../lib/tabs/handleTabs";
import { ButtonIcon } from "../misc/button";

const Navbar: NextComponentType = () => {
	const { newTab, closeTab, tabs } = useTabs();
	const router = useRouter();
	const user = useUser();
	const [hydrated, setHydrated] = useState(false);
	const supabase = useSupabaseClient<Database>();
	const isDemoUser = user?.id == "d62d46a3-138b-4014-852e-f32f0421213b";
	const userMetadata = isDemoUser
		? {
				name: "Coursify Demo User",
				picture:
					"https://hhrehffmdrcjqowwvgqg.supabase.co/storage/v1/object/public/cdn/assets/demo-images/user",
				email: "demo@coursify.one",
				full_name: "Coursify Demo User",
		  }
		: user?.user_metadata ?? {};

	useEffect(() => setHydrated(true), []);

	if (router.isReady && hydrated && router.asPath.startsWith("/login")) {
		return <></>;
	}

	const logOut = async () => {
		await supabase.auth.signOut();
		router.reload();
	};

	return (
		<nav className="flex h-14 items-center justify-between bg-gray-200 px-8 compact:h-12">
			<div className="scrollbar-fancy flex shrink items-center space-x-4 overflow-x-auto">
				{defaultTabs.map((v, i) => (
					<TabUI key={i} canClose={false} tab={v} />
				))}
				<div className="graydient h-10 w-[0.07rem] "></div>
				{tabs.map(
					(v, i) => hydrated && <TabUI key={i} canClose={true} tab={v} />
				)}
			</div>
			<div className="ml-4 flex flex-grow-0 items-center space-x-4">
				<ButtonIcon icon={<MagnifyingGlassIcon className=" h-5 w-5" />} />
				<ButtonIcon
					icon={<CalendarDaysIcon className="h-5 w-5" />}
					to="/calendar"
				/>
				<ButtonIcon
					icon={<MegaphoneIcon className="h-5 w-5" />}
					to="/announcements"
				/>
				<Menu
					className="relative !ml-4 flex w-10 flex-col items-center"
					as="div"
				>
					<Menu.Button>
						{user ? (
							<Image
								src={userMetadata.picture}
								alt="Profile picture"
								referrerPolicy="no-referrer"
								className=" w-10 rounded-full shadow-md shadow-black/25 compact:w-9"
								height={40}
								width={40}
							/>
						) : (
							<div className="!ml-2 h-10 w-10 rounded-full bg-gray-300"></div>
						)}
					</Menu.Button>
					<Transition
						as={Fragment}
						enter="transition ease-out duration-100"
						enterFrom=" opacity-0 scale-95 translate-x-1 -translate-y-2"
						enterTo=" opacity-100 scale-100"
						leave="transition ease-in duration-75"
						leaveFrom=" opacity-100 scale-100"
						leaveTo=" opacity-0 scale-95 translate-x-1 -translate-y-2"
					>
						<div className="absolute right-0 z-50 mt-14">
							<Menu.Items
								as="div"
								className="flex w-48 flex-col  rounded-xl bg-gray-200/75 px-2 py-2 shadow-xl backdrop-blur-xl"
							>
								<Link
									href={`/profile/${user?.id}`}
									onClick={() =>
										newTab(
											"/profile/1e5024f5-d493-4e32-9822-87f080ad5516",
											`${userMetadata.name}'s Profile`
										)
									}
								>
									<Menu.Item as="div" className="mx-2 flex flex-col">
										<h3 className="line-clamp-2 font-medium">
											{userMetadata.full_name}
										</h3>
										<p className="truncate text-xs">{userMetadata.email}</p>
									</Menu.Item>
								</Link>
								<div className="graydient-90deg my-3 h-0.5 w-full"></div>
								<Link
									href={`/profile/${user?.id}`}
									onClick={() =>
										newTab(
											`/profile/${user?.id}`,
											`${userMetadata.name}'s Profile`
										)
									}
								>
									<Menu.Item
										as="div"
										className="flex items-center justify-between rounded-lg px-2 py-1 font-medium transition hover:bg-gray-300"
									>
										Profile <UserIcon className="h-5 w-5" />
									</Menu.Item>
								</Link>
								<Link
									href={`/groups`}
									className="mt-1"
									onClick={() => newTab("/groups")}
								>
									<Menu.Item
										as="div"
										className="flex items-center justify-between rounded-lg px-2 py-1 font-medium transition hover:bg-gray-300"
									>
										Groups <UserGroupIcon className="h-5 w-5" />
									</Menu.Item>
								</Link>
								<Link
									href={`/settings`}
									className="mt-1"
									onClick={() => newTab("/settings")}
								>
									<Menu.Item
										as="div"
										className="flex items-center justify-between rounded-lg px-2 py-1 font-medium transition hover:bg-gray-300"
									>
										Settings <Cog6ToothIcon className="h-5 w-5" />
									</Menu.Item>
								</Link>
								<Menu.Item
									as="div"
									className="mt-1 flex cursor-pointer items-center justify-between rounded-lg bg-red-500/25 px-2 py-1 font-medium transition hover:bg-red-400/50"
									onClick={() => logOut()}
								>
									Logout <ArrowLeftOnRectangleIcon className="h-5 w-5" />
								</Menu.Item>
							</Menu.Items>
						</div>
					</Transition>
				</Menu>
			</div>
		</nav>
	);

	function TabUI({ tab, canClose }: { tab: Tab; canClose: boolean }) {
		const selected = useMemo(
			() =>
				tab.matcher
					? router.pathname.match(tab.matcher)
					: router.asPath.includes(tab.route),
			[tab]
		);

		return (
			<div
				className={`mx-1 my-1.5 flex items-center rounded-lg border ${
					selected
						? "brightness-focus !shadow-md"
						: "border-transparent bg-gray-300"
				} ${canClose && "pr-2"} text-lg font-semibold compact:text-base `}
			>
				<Link href={tab.route}>
					<div
						className={`max-w-[10rem] truncate py-[0.05rem]  ${
							canClose ? "pl-2.5" : "px-2.5"
						}`}
					>
						{tab.name}
					</div>
				</Link>
				{canClose && (
					<XMarkIcon
						tabIndex={0}
						onClick={(e) => (
							e.stopPropagation(), handleClose(tab.name, selected)
						)}
						//never thought I would have had to do that manually
						onKeyDown={(key) =>
							(key.key == "Enter" || key.key == " ") &&
							(key.stopPropagation(), handleClose(tab.name, selected))
						}
						// apparently stop propagation doesn't work with nextjs links.
						// I could use router.push(), but then we would have to be in charge of preloading pages
						// I decided to instead just make the text the link. It not great but is just works:tm:
						// - Lukas
						className={`ml-2 h-5 w-5 cursor-pointer rounded-sm text-gray-500 transition hover:text-gray-800 dark:text-gray-100
									 ${selected ? "hover:bg-gray-100" : "hover:bg-gray-400/20"}`}
					/>
				)}
			</div>
		);
	}

	function handleClose(
		name: string,
		selected: RegExpMatchArray | null | boolean
	) {
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
	matcher?: RegExp;
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

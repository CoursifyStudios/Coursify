import { Tab } from "@headlessui/react";
import {
	CheckIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	MagnifyingGlassIcon,
	ShieldCheckIcon,
	UserIcon,
} from "@heroicons/react/24/outline";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import uploadImage from "@/public/svgs/add-files.svg";
import { Popup } from "@/components/misc/popup";
import { Database } from "@/lib/db/database.types";
import {
	UsersResponse,
	getRanges,
	getUsers,
	getUsersPages,
} from "@/lib/db/admin";
import { useRouter } from "next/router";
import noData from "@/public/svgs/no-data.svg";
import { ButtonIcon } from "@/components/misc/button";

type ImportedUser = {
	first_name: string;
	last_name: string;
	email: string;
	grad_year: number | null;
	parent: boolean;
	student_id: string | null;
}[];

const Admin: NextPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const user = useUser();
	const [query, setQuery] = useState("");
	const [uploadOpen, setUploadOpen] = useState(false);
	const [hovering, setHovering] = useState(false);
	const supabase = useSupabaseClient<Database>();
	const [page, setPage] = useState(1);
	const [pages, setPages] = useState(1);
	const [users, setUsers] = useState<
		| {
				id: string;
				full_name: string;
				email: string | null;
				year: string | null;
				bio: string | null;
				phone_number: number | null;
				enrolled: {
					adminBool: boolean;
				}[];
		  }[]
		| null
	>();
	const [uploadUsers, setUploadUsers] = useState<ImportedUser>([
		{
			first_name: "Steve",
			last_name: "Huffman",
			email: "steve@ex.com",
			grad_year: 2092,
			parent: false,
			student_id: "P26_0001",
		},
		{
			first_name: "Christian",
			last_name: "Selig",
			email: "chris@ex.com",
			grad_year: null,
			parent: true,
			student_id: "P26_0002",
		},
	]);
	const [uploaded, setUploaded] = useState(false);
	const [name, setName] = useState<string>();

	useEffect(() => {
		(async () => {
			if (!user || !id || !supabase) return;
			const [data, pages] = await Promise.all([
				getUsers(supabase, 1, 50, typeof id == "string" ? id : ""),
				getUsersPages(supabase, 50, typeof id == "string" ? id : ""),
			]);
			if (data.data && pages) {
				setUsers(data.data.users);
				setName(data.data.name);
				setPages(pages);
			}
		})();
	}, [id, supabase, user]);

	const search = async (goPage?: number) => {
		if (goPage) {
			setPage(goPage);
		}
		try {
			const [data, pages] = await Promise.all([
				getUsers(
					supabase,
					goPage || page,
					50,
					typeof id == "string" ? id : "",
					query
				),
				getUsersPages(supabase, 50, typeof id == "string" ? id : "", query),
			]);

			if (data.data && pages) {
				setUsers(data.data.users);
				setPages(pages);
			}
		} catch {
			setUsers(null);
		}
	};

	const parseCSVDrop = async (ev: DragEvent) => {
		ev.preventDefault();
		const files = ev.dataTransfer!.items
			? [...ev.dataTransfer!.items].map((f) => f.getAsFile()!)
			: [...ev.dataTransfer!.files];

		for (const file of files) {
			if (file.type == "text/csv") {
				if (file instanceof File) {
					const text = await file.text();
					const userData = text
						.split("\n")
						.filter((l) => l.trim() != "")
						.map((l) => l.split(","));
					const users: ImportedUser = [];

					for (const user of userData) {
						const [
							first_name,
							last_name,
							email,
							grad_year,
							parent,
							student_id,
						] = user;

						users.push({
							first_name,
							last_name,
							email,
							grad_year: parseInt(grad_year),
							parent: parent == "true",
							student_id:
								student_id == "null" ||
								student_id == "" ||
								student_id == undefined
									? null
									: student_id,
						});
					}

					setUploadUsers(users);
					setUploaded(true);
				}
			}
		}
	};

	return (
		<div className="mx-auto my-10 flex w-full max-w-screen-xl flex-col px-4">
			<h1 className="title">Admin Dashboard - {name}</h1>
			<Tab.Group as="div" className="flex grow flex-col">
				<Tab.List as="div" className="mt-6 flex max-sm:space-x-2 sm:space-x-6">
					<Tab as={Fragment}>
						{({ selected }) => (
							<div
								className={`flex cursor-pointer items-center rounded-lg border px-2.5 py-0.5 focus:outline-none ${
									selected
										? "brightness-focus"
										: "border-transparent bg-gray-200"
								} text-lg font-semibold`}
							>
								Users
							</div>
						)}
					</Tab>
					<Tab as={Fragment}>
						{({ selected }) => (
							<div
								className={`flex cursor-pointer items-center rounded-lg border px-2.5 py-0.5 focus:outline-none ${
									selected
										? "brightness-focus"
										: "border-transparent bg-gray-200"
								} text-lg font-semibold `}
							>
								Classes
							</div>
						)}
					</Tab>

					<Link
						href="/schedule-editor"
						className={`flex cursor-pointer items-center rounded-lg border px-2.5 py-0.5 focus:outline-none
									 border-transparent bg-gray-200
								 text-lg font-semibold `}
					>
						Schedule Editor
					</Link>
				</Tab.List>
				<Tab.Panels>
					<Tab.Panel>
						<div className="grid grid-cols-4 gap-4">
							<div
								className="bg-gray-200 brightness-hover cursor-pointer rounded-2xl h-36 mt-2 flex flex-col items-center justify-center col-span-2"
								onClick={() => setUploadOpen(true)}
							>
								<Image
									src={uploadImage}
									className="h-20 w-20"
									alt="Upload Files"
								/>
								<p className="font-medium">Upload .csv file</p>
							</div>
							<Popup closeMenu={() => setUploadOpen(false)} open={uploadOpen}>
								<div
									onDragOver={(ev) => {
										ev.preventDefault();
										ev.stopPropagation();
										setHovering(true);
									}}
									onDragLeave={(ev) => {
										ev.preventDefault();
										ev.stopPropagation();
										setHovering(false);
									}}
									onDrop={(ev) => {
										ev.preventDefault();
										ev.stopPropagation();
										parseCSVDrop(ev as unknown as DragEvent);
									}}
								>
									<h3 className="title-sm">Upload .csv Files</h3>
									<h4 className="font-medium mt-4 mb-2">File format</h4>
									<div className=" overflow-hidden border rounded-md divide-y">
										<div className=" [&>p]:px-2.5 [&>p]:py-2 divide-x grid grid-cols-6 font-medium">
											<p>First Name</p>
											<p>Last Name</p>
											<p>Email</p>
											<p>Grad Year</p>
											<p>Parent</p>
											<p>Student ID</p>
										</div>
										{uploadUsers.map((u) => (
											<>
												<div
													key={u.email}
													className="[&>p]:px-2.5 [&>p]:py-2 [&>p]:overflow-hidden divide-x  grid grid-cols-6"
												>
													<p>{u.first_name}</p>
													<p>{u.last_name}</p>
													<p>{u.email}</p>
													<p>{u.grad_year ?? "NULL"}</p>
													<p>{u.parent ? "Yes" : "No"}</p>
													<p>{u.student_id ?? "NULL"}</p>
												</div>
											</>
										))}
									</div>
									{uploaded ? (
										<>Insert confirm and cancel and stuff button here</>
									) : (
										<>
											<p className="text-sm italic mt-1">
												All other columns in uploaded file will be ignored. Each
												Student ID should be unqiue for each student, and is
												used to match parents to students.
											</p>
											<div className="group  mt-8 flex h-24 grow flex-col cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 transition hover:border-solid hover:bg-gray-50 hover:text-black dark:hover:bg-neutral-950 dark:hover:text-white">
												<h3 className="text-lg font-medium transition">
													Upload File
												</h3>
												<p className="text-sm">
													Drop a file anywhere or click here to select
												</p>
											</div>
										</>
									)}
								</div>
							</Popup>
							<div className="bg-gray-200 rounded-2xl h-36 mt-2 flex items-center justify-center"></div>
							<div className="bg-gray-200 rounded-2xl h-36 mt-2 flex items-center justify-center"></div>
						</div>
						<form
							className="flex my-2"
							onSubmit={(e) => {
								e.preventDefault();
								search();
							}}
						>
							<div
								className={` relative flex grow items-center pr-2 max-w-[24rem]`}
							>
								<input
									type="text"
									className="!rounded-xl grow py-1.5 placeholder:dark:text-gray-400"
									onChange={(e) => setQuery(e.target.value)}
									placeholder="Search users..."
								/>
								<MagnifyingGlassIcon className="absolute right-6 h-4 w-4" />
							</div>
						</form>
						<div className=" overflow-hidden border rounded-xl divide-y">
							<div className=" [&>p]:px-2.5 [&>p]:py-2 divide-x flex [&>p]:w-full font-medium border-b">
								<div className="grid place-items-center min-w-[3rem] max-w-[3rem]">
									<div
										className={`checkbox h-5 min-w-[1.25rem] rounded border-2 border-gray-300 transition ${"dark:bg-neutral-950"}`}
									>
										{/* <CheckIcon /> */}
									</div>
								</div>
								<p>User ID</p>
								<p>Full Name</p>
								<p>Email</p>
								<p>Graduation Year</p>
								<p>Parent</p>
								<p>Student ID</p>
							</div>
							{users ? (
								users.map((user, id) => (
									<div
										className=" [&>p]:px-2.5 [&>p]:py-2 divide-x flex [&>p]:w-full [&>p]:items-center [&>p]:truncate [&>p]:whitespace-nowrap [&>p]:overflow-hidden "
										key={user.id}
									>
										<div className="grid place-items-center min-w-[3rem] max-w-[3rem]">
											<div
												className={`checkbox h-5 min-w-[1.25rem] rounded border-2 border-gray-300 transition  ${"dark:bg-neutral-950"}`}
											>
												{/* <CheckIcon /> */}
											</div>
										</div>
										<p>{user.id}</p>
										<div className="flex w-full items-center truncate whitespace-nowrap overflow-hidden py-2 px-2.5">
											{user.enrolled[0].adminBool ? (
												<ShieldCheckIcon className="min-w-[1.25rem] h-5 text-blue-500 mr-1.5" />
											) : (
												<UserIcon className="min-w-[1.25rem] h-5 mr-1.5 text-gray-300" />
											)}{" "}
											<p className="truncate">{user.full_name}</p>
										</div>
										<p>{user.email}</p>
										<p>{user.year}</p>
										<p>Coming Soon</p>
										<p>Coming Soon</p>
									</div>
								))
							) : users === null ? (
								<div className="h-48 flex items-center justify-center flex-col">
									<Image
										src={noData}
										alt="Nothing present icon"
										width={100}
										height={100}
									/>
									<p className="font-medium mt-6">
										No users found with that name or email
									</p>
								</div>
							) : (
								<div>loading</div>
							)}
						</div>
						<div className="flex justify-center gap-4 my-4 items-center">
							<ButtonIcon
								disabled={page === 1}
								icon={<ChevronLeftIcon className="w-6 h-6 -translate-x-0.5" />}
								className={`scale-75`}
								onClick={() => search(page - 1)}
							/>
							<div className="px-3 py-1.5 rounded-xl bg-gray-200 text-xl font-medium">
								1
							</div>
							<ButtonIcon
								disabled={page === pages}
								icon={<ChevronRightIcon className="w-6 h-6 translate-x-0.5" />}
								className={`scale-75`}
								onClick={() => search(page + 1)}
							/>
						</div>
					</Tab.Panel>
					{/* <Tab.Panel>
						<div className="grid grid-cols-4 gap-4">
							<div
								className="bg-gray-200 brightness-hover cursor-pointer rounded-2xl h-36 mt-2 flex flex-col items-center justify-center col-span-2"
								onClick={() => setUploadOpen(true)}
							>
								<Image
									src={uploadImage}
									className="h-20 w-20"
									alt="Upload Files"
								/>
								<p className="font-medium">Upload .csv file</p>
							</div>
							<Popup closeMenu={() => setUploadOpen(false)} open={uploadOpen}>
								<>
									<h3 className="title-sm">Upload .csv Files</h3>
									<h4 className="font-medium mt-4 mb-2">File format</h4>
									<div className=" overflow-hidden border rounded-md divide-y">
										<div className=" [&>p]:px-2.5 [&>p]:py-2 divide-x grid grid-cols-6 font-medium">
											<p>First Name</p>
											<p>Last Name</p>
											<p>Email</p>
											<p>Grad Year</p>
											<p>Parent</p>
											<p>Student email</p>
										</div>
										<div className=" [&>p]:px-2.5 [&>p]:py-2 divide-x  grid grid-cols-6">
											<p>Steve</p>
											<p>Huffman</p>
											<p>steve@ex.com</p>
											<p>2092</p>
											<p>false</p>
											<p></p>
										</div>
										<div className=" [&>p]:px-2.5 [&>p]:py-2 divide-x  grid grid-cols-6">
											<p>Christian</p>
											<p>Selig</p>
											<p>chris@ex.com</p>
											<p></p>
											<p>true</p>
											<p>steve@ex.com</p>
										</div>
									</div>
									<p className="text-sm italic mt-1">
										All other columns will be ignored
									</p>
									<div className="group mt-8 flex h-24 grow flex-col cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 transition hover:border-solid hover:bg-gray-50 hover:text-black dark:hover:bg-neutral-950 dark:hover:text-white">
										<h3 className="text-lg font-medium transition">
											Upload File
										</h3>
										<p className="text-sm">
											Drop a file or click anywhere to select
										</p>
									</div>
								</>
							</Popup>
							<div className="bg-gray-200 rounded-2xl h-36 mt-2 flex items-center justify-center"></div>
							<div className="bg-gray-200 rounded-2xl h-36 mt-2 flex items-center justify-center"></div>
						</div>
						<div className="flex my-2">
							<div
								className={`${
									searchOpen ? "max-w-[24rem]" : "max-w-[14rem]"
								} relative flex grow items-center pr-2 transition-all`}
							>
								<input
									type="text"
									className="grow !rounded-xl py-2 placeholder:dark:text-gray-400"
									onClick={() => setSearchOpen(true)}
									onBlur={() => setSearchOpen(false)}
									placeholder="Search users..."
								/>
								<MagnifyingGlassIcon className="absolute right-6 h-4 w-4" />
							</div>
						</div>
					</Tab.Panel> */}
				</Tab.Panels>
			</Tab.Group>
		</div>
	);
};

export default Admin;

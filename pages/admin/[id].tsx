import { Tab } from "@headlessui/react";
import {
	ArrowDownTrayIcon,
	CheckIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	ClipboardDocumentListIcon,
	MagnifyingGlassIcon,
	PencilSquareIcon,
	ShieldCheckIcon,
	TrashIcon,
	UserCircleIcon,
	UserIcon,
	UsersIcon,
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
import { Button, ButtonIcon } from "@/components/misc/button";
import Dropdown from "@/components/misc/dropdown";

type ImportedUser = {
	first_name: string;
	last_name: string;
	email: string;
	grad_year: number | null;
	parent: boolean;
	student_id: string | null;
}[];

enum CSVParser {
	COURSIFY = "Coursify",
	POWERSCHOOL = "Powerschool",
	SCHOOLOGY = "Schoology",
	INFINITECAMPUS = "Infinite Campus",
	SKYWARD = "Skyward",
}

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
				student_id: string | null;
				enrolled: {
					adminBool: boolean;
				}[];
				relationships: {
					parent_id: string[] | null;
					student_id: string[] | null;
				};
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
	const [selectedSquare, setSelectedSquare] = useState<number>();
	const [selectedRow, setSelectedRow] = useState<string[]>([]);
	const [csvParser, setCSVParser] = useState<CSVParser>(CSVParser.COURSIFY);

	useEffect(() => {
		(async () => {
			if (!user || !id || !supabase || users) return;
			const [data, pages] = await Promise.all([
				getUsers(supabase, 1, 50, typeof id == "string" ? id : ""),
				getUsersPages(supabase, 50, typeof id == "string" ? id : ""),
			]);
			if (data.data && pages) {
				// @ts-expect-error relationships will never be an array
				setUsers(data.data.users);
				setName(data.data.name);
				setPages(pages);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, supabase, user]);

	const search = async (goPage?: number) => {
		setSelectedRow([]);
		setSelectedSquare(undefined);
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
				// @ts-expect-error relationships will never be an array
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

		const users: ImportedUser = [];

		for (const file of files) {
			if (file == undefined) return;
			if (file.type == "text/csv") {
				if (file instanceof File) {
					const text = await file.text();
					const userData = text
						.split("\n")
						.filter((l) => l.trim() != "")
						.map((l) => l.split(","));

					for (const user of userData) {
						const [student_id, first_name, last_name, email, grad_year] = user;

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
				}
			}

			setUploadUsers(users);
			setUploaded(true);
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
											<div
												key={u.email}
												className="[&>p]:px-2.5 [&>p]:py-2 [&>p]:overflow-hidden divide-x grid grid-cols-6"
											>
												<p>{u.first_name}</p>
												<p>{u.last_name}</p>
												<p>{u.email}</p>
												<p>{u.grad_year ?? "NULL"}</p>
												<p>{u.parent ? "Yes" : "No"}</p>
												<p>{u.student_id ?? "NULL"}</p>
											</div>
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
											<Dropdown
												selectedValue={{ name: csvParser }}
												values={[
													{
														name: CSVParser.COURSIFY,
													},
												]}
												onChange={(v) => setCSVParser(v.name)}
											/>
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
						<div className="flex mb-2 mt-4 justify-between">
							<form
								className="flex grow"
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
							<div className="flex space-x-2">
								{selectedRow.length > 0 && (
									<>
										<p>most r broken ---{">"}</p>
										<Button
											onClick={() => {
												navigator.clipboard.writeText("test	text\nmore	text");
											}}
											className="rounded-xl !px-2.5"
										>
											<ClipboardDocumentListIcon className="h-5 w-5" />
										</Button>
										{selectedSquare != undefined ? (
											<Button onClick={() => {}} className="rounded-xl !px-2.5">
												<PencilSquareIcon className="h-5 w-5" />
											</Button>
										) : (
											<>
												<Button
													onClick={() => {}}
													className="rounded-xl !px-2.5"
												>
													<ArrowDownTrayIcon className="h-5 w-5" />
												</Button>
												<Button
													onClick={() => {}}
													className="rounded-xl !px-2.5"
													color="bg-red-600/20 hover:bg-red-600/50"
												>
													<TrashIcon className="h-5 w-5" />
												</Button>
											</>
										)}
										<Button
											onClick={() => {
												setSelectedRow([]);
												setSelectedSquare(undefined);
											}}
											className="rounded-xl !ml-4"
										>
											Clear Selection
										</Button>
									</>
								)}
							</div>
						</div>
						{/* This code is an absolute mess */}
						{/* also, tables are overrated */}
						<div
							className={`select-none overflow-hidden border ${
								selectedRow.length == users?.length
									? "border-blue-500"
									: "border-gray-300"
							} rounded-xl divide-y`}
						>
							<div
								className={` [&>p]:px-2.5 [&>p]:py-2 divide-x flex [&>p]:w-full font-medium border-b border-gray-300 ${
									selectedRow.length == users?.length && "bg-blue-500/10"
								}`}
							>
								<div
									className="grid place-items-center min-w-[3rem] max-w-[3rem]"
									onClick={() => {
										setSelectedSquare(undefined);
										setSelectedRow((rows) =>
											rows.length == users?.length
												? []
												: users?.map((user) => user.id) || []
										);
									}}
								>
									<div
										className={`checkbox h-5 min-w-[1.25rem] rounded border-2 border-gray-300 transition cursor-pointer ${
											selectedRow.length == users?.length
												? "bg-gray-300"
												: "dark:bg-neutral-950"
										}`}
									>
										{selectedRow.length == users?.length && (
											<CheckIcon strokeWidth={2} />
										)}
									</div>
								</div>
								<p>User ID</p>
								<p>Full Name</p>
								<p>Email</p>
								<p>Graduation Year</p>
								<p>Relations</p>
								<p>Student ID</p>
							</div>
							{users ? (
								users.map((mappedUser, id) => {
									const svgClassname = "min-w-[1.25rem] h-5 mr-1.5";
									const parents =
										mappedUser.relationships &&
										mappedUser.relationships.parent_id;
									const students =
										mappedUser.relationships &&
										mappedUser.relationships.student_id;
									const selected = selectedRow.includes(mappedUser.id);
									return (
										<div
											className={` [&>p]:px-2.5 [&>p]:py-2 divide-x ${
												selected &&
												selectedSquare == undefined &&
												"bg-blue-500/10"
											} transition flex [&>p]:w-full [&>p]:items-center [&>p]:truncate [&>p]:whitespace-nowrap [&>p]:overflow-hidden `}
											key={mappedUser.id}
										>
											<div
												className="grid place-items-center min-w-[3rem] max-w-[3rem]"
												onClick={() => {
													setSelectedSquare(undefined);
													setSelectedRow((rows) =>
														selected && selectedSquare == undefined
															? rows.filter((row) => row != mappedUser.id)
															: selectedSquare != undefined
															? [mappedUser.id]
															: rows.concat([mappedUser.id])
													);
												}}
											>
												<div
													className={`checkbox h-5 min-w-[1.25rem] rounded border-2 border-gray-300 transition cursor-pointer ${
														selected && selectedSquare == undefined
															? "bg-gray-300"
															: "dark:bg-neutral-950"
													}`}
												>
													{selected && selectedSquare == undefined && (
														<CheckIcon strokeWidth={2} />
													)}
												</div>
											</div>
											<p
												onClick={() => {
													setSelectedSquare(0);
													setSelectedRow([mappedUser.id]);
												}}
												className={`${
													selectedSquare == 0 && selected
														? " border-blue-500 bg-blue-500/10"
														: "border-y-transparent border-r-transparent"
												} cursor-pointer !border`}
											>
												{mappedUser.id}
											</p>
											<div
												onClick={() => {
													setSelectedSquare(1);
													setSelectedRow([mappedUser.id]);
												}}
												className={`${
													selectedSquare == 1 && selected
														? " border-blue-500 bg-blue-500/10"
														: "border-y-transparent border-r-transparent"
												} cursor-pointer !border flex w-full items-center truncate whitespace-nowrap overflow-hidden py-2 px-2.5`}
											>
												{mappedUser.enrolled[0].adminBool ? (
													<ShieldCheckIcon
														className={`${svgClassname} text-blue-500`}
													/>
												) : (
													<UserIcon
														className={`${svgClassname} text-gray-300`}
													/>
												)}{" "}
												<p className="truncate">{mappedUser.full_name}</p>
											</div>
											<p
												onClick={() => {
													setSelectedSquare(2);
													setSelectedRow([mappedUser.id]);
												}}
												className={`${
													selectedSquare == 2 && selected
														? " border-blue-500 bg-blue-500/10"
														: "border-y-transparent border-r-transparent"
												} cursor-pointer !border`}
											>
												{mappedUser.email}
											</p>
											<p
												onClick={() => {
													setSelectedSquare(3);
													setSelectedRow([mappedUser.id]);
												}}
												className={`${
													selectedSquare == 3 && selected
														? " border-blue-500 bg-blue-500/10"
														: "border-y-transparent border-r-transparent"
												} cursor-pointer !border`}
											>
												{mappedUser.year}
											</p>
											<div
												onClick={() => {
													setSelectedSquare(4);
													setSelectedRow([mappedUser.id]);
												}}
												className={`${
													selectedSquare == 4 && selected
														? " border-blue-500 bg-blue-500/10"
														: "border-y-transparent border-r-transparent"
												} cursor-pointer !border flex w-full items-center truncate whitespace-nowrap overflow-hidden py-2 px-2.5`}
											>
												{parents && (
													<>
														<UsersIcon
															className={`${svgClassname} text-blue-500`}
														/>
														<p className="truncate">{parents.join(", ")}</p>
													</>
												)}
												{students && (
													<>
														<UserCircleIcon
															className={`${svgClassname} text-gray-300`}
														/>
														<p className="truncate">{students.join(", ")}</p>
													</>
												)}
											</div>
											<p
												onClick={() => {
													setSelectedSquare(5);
													setSelectedRow([mappedUser.id]);
												}}
												className={`${
													selectedSquare == 5 && selected
														? " border-blue-500 bg-blue-500/10"
														: "border-y-transparent border-r-transparent"
												} cursor-pointer !border`}
											>
												{mappedUser.student_id}
											</p>
										</div>
									);
								})
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

			<div className="flex gap-8 p-4 [&>div]:flex [&>div]:gap-2 [&>div]:items-center text-gray-600 dark:text-gray-400 font-medium mx-auto">
				<div>
					<ShieldCheckIcon className="w-5 h-5 text-blue-500" />
					<p>Admin Account</p>
				</div>
				<div>
					<UserIcon className="w-5 h-5 text-gray-300" />
					<p>Student Account</p>
				</div>
				<div>
					<UsersIcon className="w-5 h-5 text-blue-500" /> <p>Parent</p>
				</div>
				<div>
					<UserCircleIcon className="w-5 h-5 text-gray-300" /> <p>Student</p>
				</div>
			</div>
		</div>
	);
};

export default Admin;

// How tf is this so long

import { Tab } from "@headlessui/react";
import {
	AcademicCapIcon,
	ArrowDownTrayIcon,
	CheckIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	ClipboardDocumentListIcon,
	MagnifyingGlassIcon,
	PencilSquareIcon,
	ShieldCheckIcon,
	TrashIcon,
	UserIcon,
	UsersIcon,
} from "@heroicons/react/24/outline";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import {
	Dispatch,
	Fragment,
	SetStateAction,
	useEffect,
	useMemo,
	useState,
} from "react";
import uploadImage from "@/public/svgs/add-files.svg";
import addUserImage from "@/public/svgs/add-user.svg";
import serverImage from "@/public/svgs/server.svg";
import { Popup } from "@/components/misc/popup";
import { Database } from "@/lib/db/database.types";
import { getUsers, getUsersPages, setAdmin, updateUser } from "@/lib/db/admin";
import { useRouter } from "next/router";
import noData from "@/public/svgs/no-data.svg";
import { Button, ButtonIcon } from "@/components/misc/button";
import Dropdown from "@/components/misc/dropdown";
import Betatag from "@/components/misc/betatag";
import { ExportToCsv } from "export-to-csv";
import Loading from "@/components/misc/loading";
import { Form, Formik } from "formik";

/**
 * This file is not intended for long term use.
 * It's a quickly made stopgap measure that probably shouldn't exist.
 * We don't have time to develop a real admin dashboard and spend the
 * time mocking up designs, testing it, learning new app dir stuff, etc.
 * If any of this code is still used second semester something went horribly wrong
 */

type ImportedUsers = {
	first_name: string;
	last_name: string;
	email: string;
	grad_year: number | null;
	//parent: boolean;
	student_id: string | null;
	preferred_name?: string;
	phone_number?: string;
	bio?: string;
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
	const [loading, setLoading] = useState(false);
	const [pages, setPages] = useState(1);
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [createUserOpen, setCreateUserOpen] = useState(false);
	const [dbActionsOpen, setDBActionsOpen] = useState(false);
	const [users, setUsers] = useState<
		| {
				id: string;
				full_name: string;
				email: string | null;
				year: string | null;
				bio: string | null;
				phone_number: string | null;
				student_id: string | null;
				enrolled: {
					admin_bool: boolean;
				}[];
				relationships: {
					parent_id: string[] | null;
					student_id: string[] | null;
				};
		  }[]
		| null
	>();

	const [uploadUsers, setUploadUsers] = useState<ImportedUsers>([
		{
			first_name: "Steve",
			last_name: "Huffman",
			email: "steve@ex.com",
			grad_year: 2092,
			//parent: false,
			student_id: "P26_0001",
		},
		{
			first_name: "Christian",
			last_name: "Selig",
			email: "chris@ex.com",
			grad_year: null,
			//parent: true,
			student_id: "P26_0002",
		},
	]);
	const [uploaded, setUploaded] = useState(false);
	const [name, setName] = useState<string>();
	const [selectedSquare, setSelectedSquare] = useState<number>();
	const [selectedRows, setSelectedRows] = useState<string[]>([]);
	const [csvParser, setCSVParser] = useState<CSVParser>(CSVParser.COURSIFY);
	const [notifications, setNotifications] = useState<
		{ name: string; expireAt: number }[]
	>([]);

	const selectedUser = useMemo(
		() => users?.find((user) => user.id == selectedRows[0]),
		[selectedRows, users]
	);

	const [cell, setCell] = useState<{
		name: string;
		content: string;
		modified: "full_name" | "email" | "phone_number" | "year" | "student_id";
	}>({ name: "", content: "", modified: "full_name" });

	useEffect(() => {
		switch (selectedSquare) {
			case 0:
				setCell({
					name: "Full Name",
					content: selectedUser!.full_name || "",
					modified: "full_name",
				});
				break;
			case 1:
				setCell({
					name: "Email",
					content: selectedUser!.email || "",
					modified: "email",
				});
				break;
			case 2:
				setCell({
					name: "Phone number",
					content: selectedUser!.phone_number || "",
					modified: "phone_number",
				});
				break;
			case 3:
				setCell({
					name: "Graduation Year",
					content: selectedUser!.year || "",
					modified: "year",
				});
				break;
			case 4:
				break;
			case 5:
				setCell({
					name: "Student ID",
					content: selectedUser!.student_id || "",
					modified: "student_id",
				});
				break;
		}
	}, [selectedSquare, selectedUser]);

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

	useEffect(() => {
		const intervals: NodeJS.Timeout[] = [];

		for (const notification of notifications) {
			intervals.push(
				setTimeout(() => {
					setNotifications(
						notifications.filter((v) => v.expireAt != notification.expireAt)
					);
				}, notification.expireAt - Date.now())
			);
		}

		return () => {
			for (const interval of intervals) {
				clearTimeout(interval);
			}
		};
	}, [notifications]);

	const search = async (goPage?: number) => {
		setSelectedRows([]);
		setSelectedSquare(undefined);
		setLoading(true);
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
		setLoading(false);
	};

	const parseCSVDrop = async (ev: DragEvent) => {
		ev.preventDefault();
		const files = ev.dataTransfer!.items
			? [...ev.dataTransfer!.items].map((f) => f.getAsFile()!)
			: [...ev.dataTransfer!.files];

		const users: ImportedUsers = [];

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
						switch (csvParser) {
							case CSVParser.COURSIFY: {
								const [student_id, first_name, last_name, email, grad_year] =
									user;

								users.push({
									first_name,
									last_name,
									email,
									grad_year: parseInt(grad_year),
									// parent: parent == "true",
									student_id:
										student_id == "null" ||
										student_id == "" ||
										student_id == undefined
											? null
											: student_id,
								});
								break;
							}
							case CSVParser.SCHOOLOGY: {
								/*
Name	Description
Schoology User ID	The unique user ID assigned by Schoology x
Unique User ID	The Unique ID field in Schoology, which is often a student ID assigned in the SIS x
SIS User ID	The SIS user ID may be used for organizations that have imported PowerSchool Learning content only. x
School NID	The unique school ID assigned by Schoology x
School Title	The name of the main school the user is affiliated with x
Additional Schools	The NIDs of additional schools the user is affiliated with x
Name Prefix	The user's honorific or prefix (ex. Mr., Mrs., Dr.) x
First Name	The user's first name x
First Name (preferred)	The user's preferred first name x
Last Name	The user's last name x
Role	The user's role within Schoology (ex. Student, Parent, Teacher) x
Username	The username assigned by the district x
Email	The user's email address x
Position/Job Title	The user's position, as displayed on their profile
Graduation Year	The user's graduation date x
Birthday	The user's birthday
Gender	The user's gender
Bio	The user's bio information, as displayed on their profile
Subjects Taught	The subject(s) the user teaches
Levels Taught	The level(s) the user teaches
Phone Number	The user's phone number
Website	The user's website
Interests	The user's interests, as displayed on their profile
Activities	The user's activities, as displayed on their profile
								*/
								const [
									_,
									student_id,
									__,
									___,
									____,
									_____,
									______,
									first_name,
									preferred_name,
									last_name,
									_______,
									________,
									email,
									_________,
									grad_year,
									__________,
									___________,
									bio,
									____________,
									_____________,
									phone_number,
								] = user;

								users.push({
									first_name,
									last_name,
									email,
									grad_year: parseInt(grad_year),
									// parent: parent == "true",
									student_id:
										student_id == "null" ||
										student_id == "" ||
										student_id == undefined
											? null
											: student_id,
									phone_number,
									bio,
									preferred_name,
								});
							}
						}
					}
				}
			}

			setUploadUsers(users);
			setUploaded(true);
		}
	};

	const addNewUsers = async (users: ImportedUsers) => {
		await supabase.from("users").insert(
			users.map((u) => ({
				full_name: `${u.first_name} ${u.last_name}`,
				// Temp UUID to be replaced when the user logs in
				id: "00000000-0000-0000-0000-000000000000",
				avatar_url:
					"https://cdn.coursify.one/storage/v1/object/public/cdn/assets/Coursify/default-picture.png",
				bio: u.bio,
				email: u.email,
				phone_number: u.phone_number,
				year: u.grad_year?.toString(),
				student_id: u.student_id,
				preferred_name: u.preferred_name,
			}))
		);
	};

	const newNotification = (name: string) => {
		setNotifications((v) => v.concat([{ name, expireAt: Date.now() + 2000 }]));
	};

	const copyID = async () => {
		navigator.clipboard.writeText(selectedRows.join(", "));
		newNotification("Copied selected row id(s)");
	};

	const copyRows = async () => {
		navigator.clipboard.writeText(
			(!users
				? []
				: users
						.filter((user) => selectedRows.includes(user.id))
						.map((user) =>
							[
								user.full_name,
								user.email,
								user.phone_number,
								user.year,
								[
									"Parents: ",
									user.relationships && user.relationships.parent_id
										? user.relationships.parent_id?.join(", ")
										: "",
									", Students: ",
									user.relationships && user.relationships.student_id
										? user.relationships.student_id?.join(", ")
										: "",
								].join(""),
								user.student_id,
							].join("\t")
						)
			).join("\n")
		);
		newNotification("Copied selected row(s)");
	};

	const copyCell = async () => {
		const user = users?.find((user) => user.id == selectedRows[0]);
		if (!user) return;
		let text: string | null = "";
		switch (selectedSquare) {
			case 0:
				text = user.full_name;
				break;
			case 1:
				text = user.email;
				break;
			case 2:
				text = user.phone_number;
				break;
			case 3:
				text = user.year;
				break;
			case 4:
				text = [
					"Parents: ",
					user.relationships && user.relationships.parent_id
						? user.relationships.parent_id?.join(", ")
						: "",
					", Students: ",
					user.relationships && user.relationships.student_id
						? user.relationships.student_id?.join(", ")
						: "",
				].join("");
				break;
			case 5:
				text = user.student_id;
				break;
		}
		//blunder
		navigator.clipboard.writeText(text ?? "");

		newNotification("Copied cell content!");
	};

	const downloadRows = async () => {
		const data = !users
			? []
			: users
					.filter((user) => selectedRows.includes(user.id))
					.map((user) => {
						return {
							full_name: user.full_name,
							email: user.email,
							phone: user.phone_number,
							year: user.year,

							relations: [
								"Parents: ",
								user.relationships && user.relationships.parent_id
									? user.relationships.parent_id?.join(", ")
									: "",
								", Students: ",
								user.relationships && user.relationships.student_id
									? user.relationships.student_id?.join(", ")
									: "",
							].join(""),
							studentID: user.student_id,
						};
					});
		const options = {
			title: "Coursify User Data",
			useKeysAsHeaders: true,
			filename: "exported_coursify_user_data",
		};
		new ExportToCsv(options).generateCsv(data);
		newNotification("Downloaded selected row(s)");
	};

	const updateAdmin = async (admin: boolean) => {
		setLoading(true);
		const { error } = await setAdmin(
			supabase,
			selectedRows,
			admin,
			id as string
		);
		if (error) {
			newNotification(`Error: ${error.message}`);
			setLoading(false);
			return;
		}
		setUsers(
			(users) =>
				users?.map((mappedUser) => {
					if (selectedRows.includes(mappedUser.id)) {
						return {
							...mappedUser,
							enrolled: [
								{
									admin_bool: admin,
								},
							],
						};
					}
					return mappedUser;
				})
		);

		newNotification(`Set user(s) to ${admin ? "admin" : "standard account"}`);
		setLoading(false);
	};

	const editCell = async (value: string) => {
		setLoading(true);

		const user = users?.find((user) => user.id == selectedRows[0]);
		const { error } = await updateUser(
			supabase,
			user!.id,
			cell.modified,
			value
		);

		if (error) {
			newNotification(`Error: ${error.message}`);
		} else {
			newNotification(`Updated ${cell.modified} for ${user!.full_name}`);
			setUsers(
				(users) =>
					users?.map((mappedUser) => {
						if (mappedUser.id == user!.id) {
							return {
								...mappedUser,
								[cell.modified]: value,
							};
						}
						return mappedUser;
					})
			);
		}
		setLoading(false);
	};

	const deleteUsers = async () => {
		setLoading(true);
		const errors = await Promise.all([
			await supabase
				.from("enrolled")
				.delete()
				.or(selectedRows.map((id) => `${id}.eq.user_id`).join(",")),
			// uhhhhhh how the FUCK do I do this
			// Delete from submissions, assignment comments (Waiting on ), starred for assignments in school
		]);
		setLoading(false);
		if (errors.map((error) => error.error !== null).includes(true)) {
			newNotification("Something went wrong, please try again");
		} else {
			newNotification("Deleted selected user(s)");
		}
	};

	return (
		<div className="mx-auto my-10 flex w-full max-w-screen-xl flex-col px-4">
			<h1 className="title">Admin Dashboard - {name}</h1>
			<div className="fixed bottom-4 right-4">
				{notifications.map((v) => (
					<p
						className="px-4 py-2 bg-blue-500 mt-2 rounded-xl font-medium transition-opacity"
						key={v.expireAt}
					>
						{v.name}
					</p>
				))}
			</div>

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
								<p className="font-medium">
									Upload User List in{" "}
									<span className="rounded bg-gray-300 px-1">.csv</span> Format
								</p>
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
												<p></p>
												{/* <p>{u.parent ? "Yes" : "No"}</p> */}
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
													{
														name: CSVParser.SCHOOLOGY,
													},
												]}
												onChange={(v) => setCSVParser(v.name)}
											/>
											<div className="group mt-8 flex h-24 grow flex-col cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 transition hover:border-solid hover:bg-gray-50 hover:text-black dark:hover:bg-neutral-950 dark:hover:text-white">
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
							<div
								className="bg-gray-200 brightness-hover cursor-pointer rounded-2xl h-36 mt-2 flex flex-col items-center justify-center"
								onClick={() => setCreateUserOpen(true)}
							>
								<Image
									src={addUserImage}
									className="h-20 w-20"
									alt="Upload Files"
								/>
								<p className="font-medium">Create User</p>
							</div>
							<Popup
								closeMenu={() => setCreateUserOpen(false)}
								open={createUserOpen}
							></Popup>
							<div className="bg-gray-200 brightness-hover cursor-pointer rounded-2xl h-36 mt-2 flex flex-col items-center justify-center">
								<Image
									src={serverImage}
									className="h-20 w-20"
									alt="Upload Files"
								/>
								{/* In case i forget what this does: allows admins to make 
								global changes to the db, i.e. download all/specified users, delete all/specified users, etc.
								probably other stuff too */}
								<p className="font-medium">Database Actions</p>
							</div>
						</div>
						<EditCellUI
							cell={cell}
							editCell={editCell}
							open={editOpen}
							setOpen={setEditOpen}
						/>
						<DeleteUI
							open={deleteOpen}
							setOpen={setDeleteOpen}
							deleteUsers={deleteUsers}
						/>
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
								{loading && <Loading className="my-auto" />}
								{selectedRows.length > 0 && (
									<>
										{selectedSquare != undefined ? (
											<>
												<Button
													onClick={copyCell}
													className="rounded-xl !px-2.5"
												>
													<ClipboardDocumentListIcon className="h-5 w-5" />
												</Button>
												{selectedSquare != 4 && (
													<Button
														onClick={() => setEditOpen(true)}
														className="rounded-xl !px-2.5"
													>
														<PencilSquareIcon className="h-5 w-5" />
													</Button>
												)}
											</>
										) : (
											<>
												<Button
													onClick={copyRows}
													className="rounded-xl !px-2.5"
												>
													<ClipboardDocumentListIcon className="h-5 w-5" />
												</Button>
												<Button onClick={copyID} className="rounded-xl !px-2.5">
													<p className="font-medium text-lg">ID</p>
												</Button>
												<Button
													onClick={downloadRows}
													className="rounded-xl !px-2.5"
												>
													<ArrowDownTrayIcon className="h-5 w-5" />
												</Button>
												{users &&
												users.filter(
													(user) =>
														selectedRows.includes(user.id) &&
														user.enrolled[0].admin_bool
												).length > 0 ? (
													<Button
														className="rounded-xl !px-2.5"
														onClick={() => updateAdmin(false)}
													>
														<UserIcon className="h-5 w-5 " />
													</Button>
												) : (
													<Button
														className="rounded-xl !px-2.5"
														onClick={() => updateAdmin(true)}
													>
														<ShieldCheckIcon className="h-5 w-5 text-blue-500" />
													</Button>
												)}
												<Button
													onClick={() => setDeleteOpen(true)}
													className="rounded-xl !px-2.5"
													color="bg-red-600/20 hover:bg-red-600/50"
												>
													<TrashIcon className="h-5 w-5" />
												</Button>
											</>
										)}
										<Button
											onClick={() => {
												setSelectedRows([]);
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
								selectedRows.length == users?.length
									? "border-blue-500"
									: "border-gray-300"
							} rounded-xl divide-y`}
						>
							<div
								className={` [&>p]:px-2.5 [&>p]:py-2 divide-x flex [&>p]:w-full font-medium border-b border-gray-300 ${
									selectedRows.length == users?.length && "bg-blue-500/10"
								}`}
							>
								<div
									className="grid place-items-center min-w-[3rem] max-w-[3rem]"
									onClick={() => {
										setSelectedSquare(undefined);
										setSelectedRows((rows) =>
											rows.length == users?.length
												? []
												: // brilliant
												  users?.map((user) => user.id) || []
										);
									}}
								>
									<div
										className={`checkbox h-5 min-w-[1.25rem] rounded border-2 border-gray-300 transition cursor-pointer ${
											selectedRows.length == users?.length
												? "bg-gray-300"
												: "dark:bg-neutral-950"
										}`}
									>
										{selectedRows.length == users?.length && (
											<CheckIcon strokeWidth={2} />
										)}
									</div>
								</div>

								<p>Full Name</p>
								<p>Email</p>
								<p>Phone</p>
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
									const selected = selectedRows.includes(mappedUser.id);
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
													setSelectedRows((rows) =>
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

											<div
												onClick={() => {
													setSelectedSquare(0);
													setSelectedRows([mappedUser.id]);
												}}
												className={`${
													selectedSquare == 0 && selected
														? " border-blue-500 bg-blue-500/10"
														: "border-y-transparent border-r-transparent"
												} cursor-pointer !border flex w-full items-center truncate whitespace-nowrap overflow-hidden py-2 px-2.5`}
											>
												{mappedUser.enrolled[0].admin_bool ? (
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
													setSelectedSquare(1);
													setSelectedRows([mappedUser.id]);
												}}
												className={`${
													selectedSquare == 1 && selected
														? " border-blue-500 bg-blue-500/10"
														: "border-y-transparent border-r-transparent"
												} cursor-pointer !border`}
											>
												{mappedUser.email}
											</p>
											<p
												onClick={() => {
													setSelectedSquare(2);
													setSelectedRows([mappedUser.id]);
												}}
												className={`${
													selectedSquare == 2 && selected
														? " border-blue-500 bg-blue-500/10"
														: "border-y-transparent border-r-transparent"
												} cursor-pointer !border`}
											>
												{mappedUser.phone_number}
											</p>
											<p
												onClick={() => {
													setSelectedSquare(3);
													setSelectedRows([mappedUser.id]);
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
													setSelectedRows([mappedUser.id]);
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
														<AcademicCapIcon
															className={`${svgClassname} text-gray-300`}
														/>
														<p className="truncate">{students.join(", ")}</p>
													</>
												)}
											</div>
											<p
												onClick={() => {
													setSelectedSquare(5);
													setSelectedRows([mappedUser.id]);
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
							) : // bad way to implement searching, congrats to myself
							users === null ? (
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
					<p>Standard Account</p>
				</div>
				<div>
					<UsersIcon className="w-5 h-5 text-blue-500" /> <p>Parent</p>
				</div>
				<div>
					<AcademicCapIcon className="w-5 h-5 text-gray-300" /> <p>Student</p>
				</div>
			</div>
			<div className="flex items-center mx-auto text-sm text-gray-500">
				<p className="mr-2">Coursify Admin Dashboard</p>
				<Betatag />
			</div>
		</div>
	);
};

function EditCellUI({
	editCell,
	open,
	setOpen,
	cell,
}: {
	// This is a complete mess
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	editCell: (value: string) => void;
	cell: {
		name: string;
		content: string;
		modified: "full_name" | "email" | "phone_number" | "year" | "student_id";
	};
}) {
	const [content, setContent] = useState<string>();

	useEffect(() => {
		if (content == undefined && cell.content && open) {
			setContent(cell.content);
		}
	}, [cell.content, content, open]);

	return (
		<Popup
			open={open}
			closeMenu={() => {
				setOpen(false);
				setContent(undefined);
			}}
		>
			<form
				className="flex flex-col p-2"
				onSubmit={(e) => {
					e.preventDefault();
					setOpen(false);
					editCell(content || "");
					setContent(undefined);
				}}
			>
				<h2 className="title-sm mb-4">Edit Field</h2>
				<label className="flex flex-col ">
					<span className="text-sm font-medium mb-0.5">{cell.name}</span>

					<input
						type="text"
						onChange={(v) => setContent(v.target.value)}
						value={content}
						autoFocus
						placeholder={cell.content}
					/>
				</label>
				<Button
					className="ml-auto mt-4 text-white"
					type="submit"
					color="bg-blue-500"
				>
					Save
				</Button>
			</form>
		</Popup>
	);
}

function DeleteUI({
	open,
	setOpen,
	deleteUsers,
}: {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	deleteUsers: () => void;
}) {
	const [confirmed, setConfirmed] = useState(false);

	return (
		<Popup
			open={open}
			closeMenu={() => {
				setOpen(false);
				setConfirmed(false);
			}}
		>
			<form
				className="flex flex-col p-2"
				onSubmit={(e) => {
					e.preventDefault();
					setOpen(false);
				}}
			>
				<h2 className="title-sm mb-4">Delete User(s)</h2>
				<label className="flex flex-col ">
					<span className="text-sm font-medium mb-0.5">
						Type {`"`}This action is irreversible{`"`} to confirm you wish to
						delete the selected user(s).
					</span>

					<input
						type="text"
						onChange={(v) =>
							v.target.value.toLowerCase() == "this action is irreversible"
								? setConfirmed(true)
								: setConfirmed(false)
						}
						autoFocus
						placeholder={"This action is irreversible"}
					/>
				</label>
				<Button
					className="ml-auto mt-4 text-white"
					type="submit"
					color="bg-red-500"
					disabled={!confirmed}
					onClick={deleteUsers}
				>
					Delete
				</Button>
			</form>
		</Popup>
	);
}

export default Admin;

// How tf is this so long

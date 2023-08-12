import { Listbox, Tab } from "@headlessui/react";
import {
	AcademicCapIcon,
	ArrowDownTrayIcon,
	ArrowTopRightOnSquareIcon,
	CheckIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronUpDownIcon,
	ClipboardDocumentListIcon,
	EllipsisVerticalIcon,
	MagnifyingGlassIcon,
	PencilSquareIcon,
	ShieldCheckIcon,
	TrashIcon,
	UserGroupIcon,
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
	ReactElement,
	ReactNode,
	SetStateAction,
	useEffect,
	useMemo,
	useState,
} from "react";
import uploadImage from "@/public/svgs/add-files.svg";
import addUserImage from "@/public/svgs/add-user.svg";
import serverImage from "@/public/svgs/server.svg";
import { Popup } from "@/components/misc/popup";
import { Database, Json } from "@/lib/db/database.types";
import {
	getClasses,
	getClassesPages,
	getUsers,
	getUsersPages,
	setAdmin,
	updateClass,
	updateClassUsers,
	updateUser,
} from "@/lib/db/admin";
import { useRouter } from "next/router";
import noData from "@/public/svgs/no-data.svg";
import { Button, ButtonIcon } from "@/components/misc/button";
import Dropdown from "@/components/misc/dropdown";
import Betatag from "@/components/misc/betatag";
import { ExportToCsv } from "export-to-csv";
import Loading, { LoadingSmall } from "@/components/misc/loading";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import ImagePicker from "@/components/pickers/imagePicker";
import Layout from "@/components/layout/layout";
import { NextPageWithLayout } from "../_app";
import { getBulkUserData, getUserData } from "@/lib/db/settings";
import { Toggle } from "@/components/misc/toggle";
import MenuSelect from "@/components/misc/menu";
import Avatar from "@/components/misc/avatar";

/**
 * This file is not intended for long term use.
 * It's a quickly made stopgap measure that probably shouldn't exist.
 * We don't have time to develop a real admin dashboard and spend the
 * time mocking up designs, testing it, learning new app dir stuff, etc.
 * If any of this code is still used second semester something went horribly wrong
 *
 * By the way we're using Deno Fresh rather than Next.js app dir - Lukas
 * Epic - Bloxs
 *
 * SLANDER - Actually Lukas
 * NUH UH - Bloxs
 *
 * https://media.discordapp.net/attachments/1125697548401782867/1133178315453255791/5A664F27-A31B-4A1F-AB66-AD888508A09E.gif - Lukas
 * https://cdn.discordapp.com/attachments/722942034549407775/1133916386574467122/dox.mp4 - Bloxs
 */

type ImportedUsers = {
	full_name: string;
	email: string;
	grad_year: number | null;
	//parent: boolean;
	student_id: string | null;
	preferred_name?: string;
	phone_number?: string;
	bio?: string;
}[];

// We should prob be using this rather than the type above but /shrug - Bloxs
//type ImportedUsers = Omit<Database["public"]["Tables"]["users"]["Insert"], "avatar_url">[];

enum CSVParser {
	COURSIFY = "Coursify",
	POWERSCHOOL = "Powerschool",
	SCHOOLOGY = "Schoology",
	INFINITECAMPUS = "Infinite Campus",
	SKYWARD = "Skyward",
}

const colors = [
	{ id: 1, name: "blue" },
	{ id: 2, name: "green" },
	{ id: 3, name: "purple" },
	{ id: 4, name: "red" },
	{ id: 5, name: "yellow" },
	{ id: 6, name: "orange" },
	{ id: 7, name: "gray" },
];

const Admin: NextPageWithLayout = () => {
	const router = useRouter();
	const { id } = router.query;
	const user = useUser();
	const [query, setQuery] = useState("");
	const [uploadOpen, setUploadOpen] = useState(false);
	const [hovering, setHovering] = useState(false);
	const supabase = useSupabaseClient<Database>();
	const [tab, setTab] = useState(0);
	const [loading, setLoading] = useState(false);
	const [pages, setPages] = useState(1);
	const [classesPages, setClassesPages] = useState(1);
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [createUserOpen, setCreateUserOpen] = useState(false);
	const [dbActionsOpen, setDBActionsOpen] = useState(false);
	const [page, setPage] = useState(1);
	const [users, setUsers] = useState<
		| {
				id: string;
				full_name: string;
				email: string | null;
				year: string | null;
				bio: string | null;
				phone_number: string | null;
				student_id: string | null;
				avatar_url: string;
				onboarded: boolean;
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
	const [classes, setClasses] = useState<
		| {
				id: string;
				name: string;
				description: string;
				block: number;
				schedule_type: number;
				name_full: string | null;
				room: string | null;
				color: string;
				full_description: Json;
				classpills: Json[];
				image: string | null;
				users: {
					id: string;
					full_name: string;
					email: string;
					avatar_url: string;
					class_users: {
						teacher: boolean;
						main_teacher: boolean | null;
						class_id: string;
					}[];
				}[];
		  }[]
		| null
	>();

	const [uploadUsers, setUploadUsers] = useState<ImportedUsers>([
		{
			full_name: "Steve Huffman",
			email: "steve@ex.com",
			grad_year: 2092,
			//parent: false,
			student_id: "P26_0001",
		},
		{
			full_name: "Christian Selig",
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
	const [selectedColor, setSelectedColor] = useState(colors[0]);

	const selectedUser = useMemo(
		() => users?.find((user) => user.id == selectedRows[0]),
		[selectedRows, users]
	);

	const selectedClass = useMemo(
		() => classes?.find((mappedClass) => mappedClass.id == selectedRows[0]),
		[selectedRows, classes]
	);

	const [cell, setCell] = useState<{
		name: string;
		content: string;
		modified?: "full_name" | "email" | "phone_number" | "year" | "student_id";
		cmodified?:
			| "name"
			| "name_full"
			| "image"
			| "block"
			| "schedule_type"
			| "room";
	}>({ name: "", content: "", modified: "full_name", cmodified: "name" });

	useEffect(() => {
		if (tab == 0) {
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
						name: "Phone Number",
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
		} else if (tab == 1) {
			switch (selectedSquare) {
				case 0:
					setCell({
						name: "Name",
						content: selectedClass!.name || "",
						cmodified: "name",
					});
					break;
				case 1:
					setCell({
						name: "Full Name",
						content: selectedClass!.name_full || "",
						cmodified: "name_full",
					});
					break;
				case 2:
					setCell({
						name: "Image",
						content: selectedClass!.image || "",
						cmodified: "image",
					});
					break;
				case 3:
					setCell({
						name: "Block",
						content: selectedClass!.block.toString() || "",
						cmodified: "block",
					});
					break;
				case 4:
					setCell({
						name: "Schedule Type",
						content: selectedClass!.schedule_type.toString() || "",
						cmodified: "schedule_type",
					});
					break;
				case 5:
					setCell({
						name: "Room",
						content: selectedClass!.room || "",
						cmodified: "room",
					});
					break;
			}
		}
	}, [selectedSquare, selectedUser, tab, selectedClass]);

	useEffect(() => {
		(async () => {
			if (!user || !id || !supabase || users) return;
			const sid = typeof id == "string" ? id : "";
			const [data, pages, classesData, classesPages] = await Promise.all([
				getUsers(supabase, 1, 50, sid),
				getUsersPages(supabase, 50, sid),
				getClasses(supabase, 1, 50, sid),
				getClassesPages(supabase, 50, sid),
			]);

			if (data.data && pages && classesData.data) {
				// @ts-expect-error relationships will never be an array
				setUsers(data.data.users);
				setName(data.data.name);
				setPages(pages);
				setClasses(classesData.data.classes);
				setClassesPages(classesPages);
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

	const search = async (classes: boolean, goPage?: number) => {
		setSelectedRows([]);
		setSelectedSquare(undefined);
		setLoading(true);
		if (goPage) {
			setPage(goPage);
		}
		try {
			const [data, pages] = classes
				? await Promise.all([
						getClasses(
							supabase,
							goPage || page,
							50,
							typeof id == "string" ? id : "",
							query
						),
						getClassesPages(
							supabase,
							50,
							typeof id == "string" ? id : "",
							query
						),
				  ])
				: await Promise.all([
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
				classes ? setClasses(data.data.classes) : setUsers(data.data.users);
				classes ? setClassesPages(pages) : setPages(pages);
			}
		} catch {
			classes ? setClasses(null) : setUsers(null);
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
									full_name: `${first_name} ${last_name}`,
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
									full_name: `${first_name} ${last_name}`,
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
		setLoading(true);
		setCreateUserOpen(false);

		const dataToSend: {
			schoolId: string;
			studentsToEnroll: Omit<
				Omit<Database["public"]["Tables"]["users"]["Insert"], "avatar_url">,
				"id"
			>[];
		} = {
			schoolId: id as string,
			studentsToEnroll: users.map((u) => ({
				full_name: u.full_name,
				email: u.email,
				bio: u.bio,
				phone_number: u.phone_number,
				preferred_name: u.preferred_name,
				student_id: u.student_id,
				year: u.grad_year,
			})),
		};

		const func = await supabase.functions.invoke<{
			error?: string;
			message?: string;
		}>("add-user", {
			body: dataToSend,
		});

		if (func.error) {
			newNotification(`An unknown error occurred`);
		} else {
			if (func.data?.error) {
				newNotification(`Error: ${func.data.error}`);
			} else {
				newNotification(`Added ${users.length} user(s)`);
			}
		}

		setLoading(false);
	};

	const newNotification = (name: string) => {
		setNotifications((v) =>
			v.concat([{ name, expireAt: Date.now() + 100000 }])
		);
	};

	const copyID = async () => {
		navigator.clipboard.writeText(selectedRows.join(", "));
		newNotification("Copied selected row id(s)");
	};

	const copyRows = async () => {
		if (tab == 0) {
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
		} else if (tab == 1) {
			navigator.clipboard.writeText(
				(!classes
					? []
					: classes
							.filter((mappedClass) => selectedRows.includes(mappedClass.id))
							.map((mappedClass) =>
								[
									mappedClass.name,
									mappedClass.name_full,
									mappedClass.image,
									mappedClass.block,
									mappedClass.schedule_type,
									mappedClass.room,
								].join("\t")
							)
				).join("\n")
			);
		}
		newNotification("Copied selected row(s)");
	};

	const copyCell = async () => {
		if (!selectedUser && !selectedClass) return;
		let text: string | null = "";
		if (selectedUser) {
			switch (selectedSquare) {
				case 0:
					text = selectedUser.full_name;
					break;
				case 1:
					text = selectedUser.email;
					break;
				case 2:
					text = selectedUser.phone_number;
					break;
				case 3:
					text = selectedUser.year;
					break;
				case 4:
					text = [
						"Parents: ",
						selectedUser.relationships && selectedUser.relationships.parent_id
							? selectedUser.relationships.parent_id?.join(", ")
							: "",
						", Students: ",
						selectedUser.relationships && selectedUser.relationships.student_id
							? selectedUser.relationships.student_id?.join(", ")
							: "",
					].join("");
					break;
				case 5:
					text = selectedUser.student_id;
					break;
			}
		} else if (selectedClass) {
			switch (selectedSquare) {
				case 0:
					text = selectedClass.name;
					break;
				case 1:
					text = selectedClass.name_full;
					break;
				case 2:
					text = selectedClass.image;
					break;
				case 3:
					text = selectedClass.block.toString();
					break;
				case 4:
					text = selectedClass.schedule_type.toString();
					break;
				case 5:
					text = selectedClass.room;
					break;
			}
		}
		//blunder
		await navigator.clipboard.writeText(text ?? "");

		newNotification("Copied cell content!");
	};

	const downloadRows = async () => {
		if (tab == 0 && users) {
			const data = users
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
						admin: user.enrolled[0].admin_bool,
					};
				});
			const options = {
				title: "Coursify User Data",
				useKeysAsHeaders: true,
				filename: "exported_coursify_user_data",
			};
			new ExportToCsv(options).generateCsv(data);
			//blunder
		} else if ((classes ?? false) && classes && tab == 1) {
			const data = classes
				.filter((mappedClass) => selectedRows.includes(mappedClass.id))
				.map((mappedClass) => {
					return {
						name: mappedClass.name,
						name_full: mappedClass.name_full,
						description: mappedClass.description,
						block: mappedClass.block,
						schedule_type: mappedClass.schedule_type,
						room: mappedClass.room,
						color: mappedClass.color,
						full_description: JSON.stringify(mappedClass.full_description),
						classpills: JSON.stringify(mappedClass.classpills),
						image: mappedClass.image,
						users: JSON.stringify(mappedClass.users),
					};
				});
			const options = {
				title: "Coursify Class Data",
				useKeysAsHeaders: true,
				filename: "exported_coursify_class_data",
			};
			new ExportToCsv(options).generateCsv(data);
		}
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

		let error: PostgrestError | null = null;

		if (selectedUser) {
			const { error: e } = await updateUser(
				supabase,
				selectedUser.id,
				cell.modified!,
				value
			);
			error = e;
		} else if (selectedClass) {
			const { error: e } = await updateClass(
				supabase,
				selectedClass.id,
				cell.cmodified!,
				value
			);
			error = e;
		}

		if (error) {
			newNotification(`Error: ${error.message}`);
		} else {
			newNotification(
				`Updated ${cell.modified || cell.cmodified}${
					(selectedUser && ` for ${selectedUser.full_name}`) || ""
				}`
			);
			if (selectedUser) {
				setUsers(
					(users) =>
						users?.map((mappedUser) => {
							if (mappedUser.id == selectedUser!.id) {
								return {
									...mappedUser,
									[cell.modified!]: value,
								};
							}
							return mappedUser;
						})
				);
			} else if (selectedClass) {
				setClasses(
					(classes) =>
						classes?.map((mappedClass) => {
							if (mappedClass.id == selectedClass!.id) {
								return {
									...mappedClass,
									[cell.cmodified!]: value,
								};
							}
							return mappedClass;
						})
				);
			}
		}
		setLoading(false);
	};

	const deleteUsers = async () => {
		setLoading(true);
		const errors = await Promise.all([
			await supabase
				.from("enrolled")
				.delete()
				.or(
					selectedRows
						.map((uid) => `and(${uid}.eq.user_id,${id}.eq.school_id)`)
						.join(",")
				),
			// uhhhhhh how the FUCK do I do this- Bloxs
			// Delete from submissions, assignment comments (Waiting on ), starred for assignments in school
			// Honestly skill issue - Lukas
		]);
		setLoading(false);
		if (errors.map((error) => error.error !== null).includes(true)) {
			newNotification("Something went wrong, please try again");
		} else {
			newNotification("Deleted selected user(s)");
		}
	};

	const createClass = async ({
		name,
		name_full,
		room,
		block,
		schedule_type,
		image,
		users,
	}: {
		name: string;
		name_full: string;
		room: string;
		block: number;
		schedule_type: number;
		image: string;
		users: ReturnedUser[];
	}) => {
		setLoading(true);
		const { data, error } = await supabase
			.from("classes")
			.insert({
				name,
				school: id as string,
				type: 0,
				block,
				name_full,
				room,
				image,
				schedule_type,
			})
			// Copy pasted from getClasses
			.select(
				`
			id
			`
			)
			.single();

		if (error != undefined) {
			newNotification("Something went wrong, please try again");
		} else {
			const { error } = await supabase.from("class_users").insert(
				users.map((u) => ({
					class_id: data.id,
					user_id: u.id,
					teacher: u.teacher,
					main_teacher: u.main_teacher,
				}))
			);

			if (error != undefined) {
				newNotification("Something went wrong, please try again");
			} else {
				newNotification(
					"Created class! Loading user data to populate dashboard..."
				);
				const { data: classData } = await supabase
					.from("classes")
					.select(
						`
				id, name, description, block, schedule_type, name_full, room, color, full_description, classpills, image,
					users (
						id, full_name, email, avatar_url,
						class_users (
							teacher, main_teacher, class_id
						)
					)
					`
					)
					.eq("id", data.id)
					.single();

				// @ts-ignore Fuck supabase - Bloxs			:skull:, also btw you coded this wrong, had to fix - Lukas
				setClasses((classes) => [...(classes ?? []), classData]);
			}
		}

		setLoading(false);
		setCreateUserOpen(false);
	};

	const deleteClasses = async () => {
		setLoading(true);
		const deleteRelations = await supabase
			.from("class_users")
			.delete()
			.or(`${selectedRows.map((cid) => `class_id.eq.${cid}`).join(",")}`);

		if (deleteRelations.error != undefined) {
			newNotification("Something went wrong, please try again");
			setLoading(false);
			return;
		}

		const deleteClasses = await supabase
			.from("classes")
			.delete()
			.or(`${selectedRows.map((cid) => `id.eq.${cid}`).join(",")}`);

		if (deleteClasses.error != undefined) {
			newNotification("Something went wrong, please try again");
		} else {
			newNotification("Deleted selected class(es)");
			setClasses((classes) =>
				(classes ?? []).filter((c) => !selectedRows.includes(c.id))
			);
		}

		setLoading(false);
	};

	const updateUsers = async (users: ReturnedUser[]) => {
		if (
			users
				.map((user) => user.id)
				.sort()
				.join(",") ===
			selectedClass?.users
				.map((user) => user.id)
				.sort()
				.join(",")
		)
			return;
		setLoading(true);
		const {
			userList: { error },
			removedUsers,
		} = await updateClassUsers(
			supabase,
			selectedClass?.id || "",
			users,
			selectedClass?.users
				.filter((user) => !users.some((u) => u.id === user.id))
				.map((user) => user.id) ?? []
		);
		const errors = removedUsers.filter((ru) => Boolean(ru.error));
		if (error) {
			newNotification(error.message);
		} else if (errors.length > 0) {
			errors.forEach((error) => newNotification(error.error?.message || ""));
		} else {
			newNotification(
				"Updated userlist! Changes may require reloading to view"
			);
		}
		setLoading(false);
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
			<EditCellUI
				cell={cell}
				editCell={editCell}
				open={editOpen}
				setOpen={setEditOpen}
				editingImage={tab == 1 && selectedSquare == 2}
			/>
			<DeleteUI
				open={deleteOpen}
				setOpen={setDeleteOpen}
				deleteUsers={tab == 0 ? deleteUsers : deleteClasses}
			/>
			<Tab.Group
				as="div"
				className="flex grow flex-col"
				selectedIndex={tab}
				onChange={(tab) => {
					setSelectedRows([]);
					setSelectedSquare(undefined);
					setPage(1);
					setTab(tab);
				}}
			>
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
									{/* <h4 className="font-medium mt-4 mb-2">File format</h4>
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
												<p>{u.full_name.split(" ").shift()}</p>
												<p>{u.full_name.split(" ").pop()}</p>
												<p>{u.email}</p>
												<p>{u.grad_year ?? "NULL"}</p>
												<p></p>
												{/* <p>{u.parent ? "Yes" : "No"}</p> /}
												<p>{u.student_id ?? "NULL"}</p>
											</div>
										))}
									</div> */}
									{uploaded ? (
										<>Uploaded List!</>
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
							>
								<h2 className="title mb-4">Create User</h2>
								<Formik
									initialValues={{
										full_name: "",
										email: "",
										phone_number: "",
										student_id: null,
										year: null,
									}}
									onSubmit={(v) => {
										addNewUsers([
											{
												email: v.email,
												full_name: v.full_name,
												grad_year: v.year || null,
												student_id: v.student_id || null,
												phone_number: v.phone_number || undefined,
											},
										]);
									}}
									validationSchema={Yup.object({
										full_name: Yup.string().required(),
										email: Yup.string().email().required(),
										phone_number: Yup.string().min(10),
										student_id: Yup.string(),
									})}
								>
									<Form className="flex flex-col gap-4">
										<label className="flex flex-col grow">
											<span className="mb-0 5 font-medium text-sm">
												Full Name<span className="ml-1 text-red-500">*</span>
											</span>
											<Field type="text" name="full_name" autoFocus />
										</label>

										<label className="flex flex-col grow">
											<span className="mb-0 5 font-medium text-sm">
												Email<span className="ml-1 text-red-500">*</span>
											</span>
											<Field type="text" name="email" />
										</label>
										<div className="flex gap-4">
											<label className="flex flex-col grow">
												<span className="mb-0 5 font-medium text-sm">
													Phone Number
												</span>
												<Field type="text" name="phone_number" />
											</label>
											<label className="flex flex-col">
												<span className="mb-0 5 font-medium text-sm">
													Student ID
												</span>
												<Field type="text" name="student_id" />
											</label>

											<label className="flex flex-col ">
												<span className="mb-0 5 font-medium text-sm">
													Graduation year
												</span>
												<Field type="number" name="year" />
											</label>
										</div>
										<p className="italic text-sm">
											Leave the Student ID and Graduation year fields blank for
											a non-student account
										</p>
										<Button
											className="text-white ml-auto"
											color="bg-blue-500"
											type="submit"
										>
											Create
										</Button>
									</Form>
								</Formik>
							</Popup>
							<div
								className="bg-gray-200 brightness-hover cursor-pointer rounded-2xl h-36 mt-2 flex flex-col items-center justify-center"
								onClick={() => setDBActionsOpen(true)}
							>
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
							<Popup
								closeMenu={() => setDBActionsOpen(false)}
								open={dbActionsOpen}
							>
								<h2 className="title text-center my-10">
									Database actions are coming soon
								</h2>
							</Popup>
						</div>

						<div className="flex mb-2 mt-4 justify-between">
							<form
								className="flex grow"
								onSubmit={(e) => {
									e.preventDefault();
									search(false);
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
														className={`${svgClassname} ${
															mappedUser.onboarded
																? "text-blue-500"
																: "text-red-500"
														}`}
													/>
												) : (
													<UserIcon
														className={`${svgClassname} ${
															mappedUser.onboarded
																? "text-gray-300"
																: "text-red-500"
														}`}
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
								onClick={() => search(false, page - 1)}
							/>
							<div className="px-3 py-1.5 rounded-xl bg-gray-200 text-xl font-medium">
								{page}
							</div>
							<ButtonIcon
								disabled={page === pages}
								icon={<ChevronRightIcon className="w-6 h-6 translate-x-0.5" />}
								className={`scale-75`}
								onClick={() => search(false, page + 1)}
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
					<Tab.Panel>
						<div className="grid grid-cols-4 gap-4">
							<div
								className="bg-gray-200 grayscale rounded-2xl h-36 mt-2 flex flex-col items-center justify-center col-span-2"
								//onClick={() => setUploadOpen(true)}
							>
								<Image
									src={uploadImage}
									className="h-20 w-20"
									alt="Upload Files"
								/>
								<p className="font-medium">
									Upload Class List in{" "}
									<span className="rounded bg-gray-300 px-1">.csv</span> Format
								</p>
							</div>
							<Popup closeMenu={() => setUploadOpen(false)} open={uploadOpen}>
								<div></div>
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
								<p className="font-medium">Create Class</p>
							</div>
							<Popup
								closeMenu={() => setCreateUserOpen(false)}
								open={createUserOpen}
							>
								<h2 className="title mb-4">Create Class</h2>
								<Formik
									initialValues={{
										name: "",
										name_full: "",
										room: "",
										block: 1,
										schedule_type: 1,
										image: "",
										users: [] as ReturnedUser[],
									}}
									onSubmit={(v) => {
										createClass(v);
									}}
									validationSchema={Yup.object({
										name: Yup.string().required().max(50),
										name_full: Yup.string().required().max(150),
										room: Yup.string(),
										block: Yup.number().required(),
										schedule_type: Yup.number().required(),
										image: Yup.string().required("Choose an image!"),
										user: Yup.array()
											.min(1, "You must have at least 1 user!")
											.of(Yup.object()),
									})}
								>
									{({ setValues, errors, values }) => (
										<Form className="flex flex-col gap-4">
											<div className="flex gap-4">
												<label className="flex flex-col grow">
													<span className="mb-0 5 font-medium text-sm">
														Name<span className="ml-1 text-red-500">*</span>
													</span>
													<Field type="text" name="name" />
													<span className=" text-red-500">
														<ErrorMessage name="name" />
													</span>
												</label>

												<label className="flex flex-col ">
													<span className="mb-0 5 font-medium text-sm">
														Room Number
													</span>
													<Field type="text" name="room" />
													<span className=" text-red-500">
														<ErrorMessage name="room" />
													</span>
												</label>
											</div>
											<label className="flex flex-col grow">
												<span className="mb-0 5 font-medium text-sm">
													Full Name<span className="ml-1 text-red-500">*</span>
												</span>
												<Field type="text" name="name_full" autoFocus />
												<span className=" text-red-500">
													<ErrorMessage name="name_full" />
												</span>
											</label>

											<div className="flex gap-4">
												<label className="flex flex-col grow">
													<span className="mb-0 5 font-medium text-sm">
														Block<span className="ml-1 text-red-500">*</span>
													</span>
													<Field type="number" name="block" />
													<span className=" text-red-500">
														<ErrorMessage name="block" />
													</span>
												</label>

												<label className="flex flex-col grow">
													<span className="mb-0 5 font-medium text-sm">
														Schedule Type
														<span className="ml-1 text-red-500">*</span>
													</span>
													<Field type="number" name="schedule_type" />
													<span className=" text-red-500">
														<ErrorMessage name="schedule_type" />
													</span>
												</label>
											</div>
											<label htmlFor="" className="flex flex-col">
												<span className="mb-0 5 font-medium text-sm">
													Image Picker
													<span className="ml-1 text-red-500">*</span>
												</span>
												<ImagePicker
													setPicked={(v) =>
														setValues((values) => {
															return { ...values, image: v };
														})
													}
												/>
												<span className=" text-red-500">
													<ErrorMessage name="image" />
												</span>
											</label>
											<UserSelector
												initialUsers={[]}
												supabase={supabase}
												setValues={(users) =>
													setValues((values) => ({ ...values, users: users }))
												}
											/>
											{/* <p className="italic text-sm">
											Leave the Student ID and Graduation year fields blank for
											a non-student account
										</p> */}
											<Button
												className="text-white ml-auto"
												color="bg-blue-500"
												type="submit"
												disabled={Boolean(
													errors.block ||
														errors.name ||
														errors.name_full ||
														errors.room ||
														errors.schedule_type ||
														!values.name ||
														!values.name_full
												)}
											>
												Create
											</Button>
										</Form>
									)}
								</Formik>
							</Popup>
							<div
								className="bg-gray-200 brightness-hover cursor-pointer rounded-2xl h-36 mt-2 flex flex-col items-center justify-center"
								onClick={() => setDBActionsOpen(true)}
							>
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
							<Popup
								closeMenu={() => setDBActionsOpen(false)}
								open={dbActionsOpen}
							>
								<h2 className="title text-center my-10">
									Database actions are coming soon
								</h2>
							</Popup>
						</div>
						<div className="flex mb-2 mt-4 justify-between">
							<form
								className="flex grow"
								onSubmit={(e) => {
									e.preventDefault();
									search(true);
								}}
							>
								<div
									className={` relative flex grow items-center pr-2 max-w-[24rem]`}
								>
									<input
										type="text"
										className="!rounded-xl grow py-1.5 placeholder:dark:text-gray-400"
										onChange={(e) => setQuery(e.target.value)}
										placeholder="Search classes..."
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
												{selectedSquare == 2 && (
													<a href={selectedClass?.image || ""} target="_blank">
														<Button className="rounded-xl !px-2.5 h-full">
															<ArrowTopRightOnSquareIcon className="h-5 w-5" />
														</Button>
													</a>
												)}
												<Button
													onClick={copyCell}
													className="rounded-xl !px-2.5"
												>
													<ClipboardDocumentListIcon className="h-5 w-5" />
												</Button>
												<Button
													onClick={() => setEditOpen(true)}
													className="rounded-xl !px-2.5"
												>
													<PencilSquareIcon className="h-5 w-5" />
												</Button>
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
												{selectedRows.length == 1 && selectedClass && (
													<>
														<UserSelector
															supabase={supabase}
															initialUsers={
																selectedClass.users?.map((user) => ({
																	id: user.id,
																	full_name: user.full_name,
																	email: user.email ?? "",
																	avatar_url: user.avatar_url,
																	teacher:
																		user.class_users.find(
																			(c) => c.class_id == selectedClass.id
																		)!.teacher || false,
																	main_teacher:
																		user.class_users.find(
																			(c) => c.class_id == selectedClass.id
																		)!.main_teacher || false,
																})) ?? []
															}
															setValues={updateUsers}
															button={
																<Button className="rounded-xl !px-2.5 h-full">
																	<UserGroupIcon className="h-5 w-5" />
																</Button>
															}
														/>

														<Button
															className="rounded-xl !px-2.5"
															onClick={() => {}}
														>
															<div
																className={`h-4 w-4 mx-0.5 rounded-full brightness-50 saturate-[5] bg-${selectedClass.color}-200`}
															></div>
														</Button>
													</>
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
												: users?.map((user) => user.id) || []
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

								<p>Name</p>
								<p>Full Name</p>
								<p>Image</p>
								<p>Block</p>
								<p>Schedule Type</p>
								<p>Room</p>
							</div>
							{classes ? (
								classes.map((mappedClass, id) => {
									const svgClassname = "min-w-[1.25rem] h-5 mr-1.5";
									const selected = selectedRows.includes(mappedClass.id);
									return (
										<div
											className={` [&>p]:px-2.5 [&>p]:py-2 divide-x ${
												selected &&
												selectedSquare == undefined &&
												"bg-blue-500/10"
											} transition flex [&>p]:w-full [&>p]:items-center [&>p]:truncate [&>p]:whitespace-nowrap [&>p]:overflow-hidden `}
											key={mappedClass.id}
										>
											<div
												className="grid place-items-center min-w-[3rem] max-w-[3rem]"
												onClick={() => {
													setSelectedSquare(undefined);
													setSelectedRows((rows) =>
														selected && selectedSquare == undefined
															? rows.filter((row) => row != mappedClass.id)
															: selectedSquare != undefined
															? [mappedClass.id]
															: rows.concat([mappedClass.id])
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
													setSelectedRows([mappedClass.id]);
												}}
												className={`${
													selectedSquare == 0 && selected
														? " border-blue-500 bg-blue-500/10"
														: "border-y-transparent border-r-transparent"
												} cursor-pointer !border flex w-full items-center truncate whitespace-nowrap overflow-hidden py-2 px-2.5`}
											>
												<div
													className={`h-4 w-4 rounded-full mr-2 brightness-50 saturate-[3] bg-${mappedClass.color}-200`}
												></div>
												<p className="truncate">{mappedClass.name}</p>
											</div>
											<p
												onClick={() => {
													setSelectedSquare(1);
													setSelectedRows([mappedClass.id]);
												}}
												className={`${
													selectedSquare == 1 && selected
														? " border-blue-500 bg-blue-500/10"
														: "border-y-transparent border-r-transparent"
												} cursor-pointer !border`}
											>
												{mappedClass.name_full}
											</p>
											<p
												onClick={() => {
													setSelectedSquare(2);
													setSelectedRows([mappedClass.id]);
												}}
												className={`${
													selectedSquare == 2 && selected
														? " border-blue-500 bg-blue-500/10"
														: "border-y-transparent border-r-transparent"
												} cursor-pointer !border`}
											>
												{mappedClass.image}
											</p>
											<p
												onClick={() => {
													setSelectedSquare(3);
													setSelectedRows([mappedClass.id]);
												}}
												className={`${
													selectedSquare == 3 && selected
														? " border-blue-500 bg-blue-500/10"
														: "border-y-transparent border-r-transparent"
												} cursor-pointer !border`}
											>
												{mappedClass.block}
											</p>
											<p
												onClick={() => {
													setSelectedSquare(4);
													setSelectedRows([mappedClass.id]);
												}}
												className={`${
													selectedSquare == 4 && selected
														? " border-blue-500 bg-blue-500/10"
														: "border-y-transparent border-r-transparent"
												} cursor-pointer !border`}
											>
												{mappedClass.schedule_type}
											</p>
											<p
												onClick={() => {
													setSelectedSquare(5);
													setSelectedRows([mappedClass.id]);
												}}
												className={`${
													selectedSquare == 5 && selected
														? " border-blue-500 bg-blue-500/10"
														: "border-y-transparent border-r-transparent"
												} cursor-pointer !border`}
											>
												{mappedClass.room}
											</p>
										</div>
									);
								})
							) : // bad way to implement searching, congrats to myself
							classes === null ? (
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
								onClick={() => search(true, page - 1)}
							/>
							<div className="px-3 py-1.5 rounded-xl bg-gray-200 text-xl font-medium">
								{page}
							</div>
							<ButtonIcon
								disabled={page === pages}
								icon={<ChevronRightIcon className="w-6 h-6 translate-x-0.5" />}
								className={`scale-75`}
								onClick={() => search(true, page + 1)}
							/>
						</div>
					</Tab.Panel>
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
					<UserIcon className="w-5 h-5 text-red-500" />
					<p>Non-onboarded Account</p>
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
	editingImage,
}: {
	// This is a complete mess
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	editCell: (value: string) => void;
	cell: {
		name: string;
		content: string;
		modified?:
			| "full_name"
			| "email"
			| "phone_number"
			| "year"
			| "student_id"
			| undefined;
		cmodified?:
			| "name"
			| "name_full"
			| "image"
			| "block"
			| "schedule_type"
			| "room"
			| undefined;
	};
	editingImage: boolean;
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
				{editingImage ? (
					<>
						<h2 className="title-sm mb-4">Choose Image</h2>
						<ImagePicker setPicked={setContent} />
					</>
				) : (
					<>
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
					</>
				)}
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
						delete the selected entries.
					</span>

					<input
						type="text"
						onChange={(v) =>
							v.target.value.toLowerCase().trim() ==
							"this action is irreversible"
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

function UserSelector({
	supabase,
	initialUsers,
	button,
	setValues,
}: {
	supabase: SupabaseClient<Database>;
	initialUsers: User[];
	button?: ReactNode;
	setValues: (users: ReturnedUser[]) => void;
}) {
	const [students, setStudents] = useState<User[]>([]);
	const [teachers, setTeachers] = useState<User[]>([]);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [userText, setUserText] = useState("");
	const [teacher, setTeacher] = useState(false);
	const [error, setError] = useState<string>();

	useEffect(() => {
		if (students.length == 0 && teachers.length == 0) {
			initialUsers.forEach((user) => {
				if (user.teacher) {
					if (user.main_teacher) {
						setTeachers((teachers) => {
							teachers.unshift(user);
							return teachers;
						});
					} else {
						setTeachers((teachers) => {
							teachers.push(user);
							return teachers;
						});
					}
				} else {
					setStudents((students) => students.concat([user]));
				}
			});
		}
		// At this point I don't care - Lukas
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialUsers]);

	const addUser = async () => {
		if (
			teachers.find(
				(teacher) => teacher.id == userText || teacher.email == userText
			) ||
			students.find(
				(student) => student.id == userText || student.email == userText
			)
		) {
			if (
				students.find(
					(student) => student.id == userText || student.email == userText
				) &&
				teacher
			) {
				setStudents((s) =>
					s.filter(
						(student) => student.id == userText || student.email == userText
					)
				);
			} else {
				setError("This user is already in this class");
				return;
			}
		}

		setLoading(true);
		setError(undefined);

		const userData = await getUserData(supabase, userText);
		if (userData.data) {
			if (teacher) {
				setTeachers((teachers) => teachers.concat([userData.data]));
			} else {
				setStudents((students) => students.concat([userData.data]));
			}
			setUserText("");
		} else if (userData.error) {
			setError(userData.error.message);
		}

		setLoading(false);
	};

	const returnUsers = () => {
		setValues(
			students
				.map((s) => ({ id: s.id, teacher: false, main_teacher: false }))
				.concat(
					teachers.map((t, i) => ({
						id: t.id,
						teacher: true,
						main_teacher: i == 0,
					}))
				)
		);
	};

	const bulkAddUsers = async () => {
		const users = userText
			.split(",")
			.map((u) => u.trim())
			.filter((u) => !teachers.find((s) => s.id == u || s.email == u));

		if (users.length == 0) {
			setUserText("");
			return;
		}

		setLoading(true);
		setError(undefined);

		const userData = await getBulkUserData(supabase, users);

		if (userData.data) {
			for (const user of userData.data) {
				if (students.find((student) => student.id == user.id)) {
					if (teacher) {
						setStudents((s) => s.filter((student) => student.id != user.id));
						setTeachers((s) => s.concat([user]));
					}
					continue;
				}
				setStudents((s) => s.concat([user]));
			}
		} else if (userData.error) {
			setError(userData.error.message + " (User doesn't exist?)");
		}

		setUserText("");
		setLoading(false);
	};

	return (
		<div>
			{button ? (
				<div className="h-full" onClick={() => setOpen(true)}>
					{button}
				</div>
			) : (
				<>
					<h3 className="text-sm font-medium">Users</h3>
					<Button
						type="button"
						className="mt-2"
						color={
							students.length == 0 && teachers.length == 0
								? "bg-blue-500"
								: undefined
						}
						onClick={() => setOpen(true)}
					>
						{students.length == 0 && teachers.length == 0
							? "Add Users"
							: "Edit Users"}
					</Button>
				</>
			)}
			<Popup
				closeMenu={() => {
					setOpen(false);
					returnUsers();
				}}
				open={open}
				size="xs"
			>
				<h2 className="title-sm">Users</h2>
				<span className="text-sm font-medium mt-4">Teachers</span>
				<div className="grid grid-cols-2 gap-2 ">
					{teachers.length == 0 ? (
						<span className="italic text-sm">No Teachers Found</span>
					) : (
						teachers.map((teacher, i) => (
							<div key={teacher.id} className="flex items-center p-2 ">
								<Image
									src={teacher.avatar_url}
									width={25}
									height={25}
									alt={`${teacher.full_name}'s profile picture`}
									className={`rounded-full mr-4 h-8 w-8 ${i == 0 && "ring"}`}
								/>
								<div className="flex flex-col max-w-[10rem]">
									<p className="font-medium truncate">{teacher.full_name}</p>
									{i == 0 && <span className="text-xs">Main teacher</span>}
								</div>
								<div className="ml-auto"></div>
								<MenuSelect
									items={[
										{
											content: "Remove",
											onClick: () =>
												setTeachers((teachers) =>
													teachers.filter((t) => t.id != teacher.id)
												),
										},
										...(i != 0
											? [
													{
														content: "Make Main Teacher",
														onClick: () =>
															setTeachers((teachers) =>
																teachers
																	.filter((t) => t.id == teacher.id)
																	.concat(
																		teachers.filter((t) => t.id != teacher.id)
																	)
															),
													},
											  ]
											: []),
									]}
								>
									<div className="ml-auto p-1 hover:bg-gray-200 cursor-pointer rounded-lg">
										<EllipsisVerticalIcon className="w-6 h-6" />
									</div>
								</MenuSelect>
							</div>
						))
					)}
				</div>
				<span className="text-sm font-medium mt-4">Students</span>
				<div className="grid grid-cols-2 gap-2 ">
					{students.length == 0 ? (
						<span className="italic text-sm">No Students Found</span>
					) : (
						students.map((student) => (
							<div key={student.id} className="flex items-center p-2">
								<Avatar
									full_name={student.full_name}
									size="8"
									avatar_url={student.avatar_url}
								/>
								<div className="ml-2.5 flex flex-col max-w-[10rem]">
									<p className="font-medium truncate">{student.full_name}</p>
									{!student.avatar_url && (
										<p className="text-xs">Non-onboarded User</p>
									)}
								</div>
								<div className="ml-auto"></div>
								<MenuSelect
									items={[
										{
											content: "Remove",
											onClick: () =>
												setStudents((students) =>
													students.filter((t) => t.id != student.id)
												),
										},
									]}
								>
									<div className="ml-auto p-1 hover:bg-gray-200 cursor-pointer rounded-lg">
										<EllipsisVerticalIcon className="w-6 h-6" />
									</div>
								</MenuSelect>
							</div>
						))
					)}
				</div>

				<div className="mt-4 flex items-center">
					<input
						type="text"
						className="grow mr-4"
						color="bg-blue-500"
						onChange={(v) => setUserText(v.target.value)}
						disabled={loading}
						value={userText}
						placeholder="User email or id seperate with , for multiple"
					/>
					<div className="flex flex-col items-center text-xs">
						<p className="mb-1">Teacher</p>
						<Toggle
							enabled={teacher}
							setEnabled={() => setTeacher((teacher) => !teacher)}
						/>
					</div>
					<Button
						type="button"
						className="ml-4"
						color="bg-blue-500"
						disabled={userText.length == 0 || loading}
						onClick={userText.includes(",") ? bulkAddUsers : addUser}
					>
						Add User
						{loading && <LoadingSmall className={`ml-2 `} />}
					</Button>
				</div>
				<span className="text-red-500">{error}</span>
			</Popup>
		</div>
	);
}

interface User {
	id: string;
	full_name: string;
	email: string;
	avatar_url: string;
	teacher?: boolean;
	main_teacher?: boolean;
}

export interface ReturnedUser {
	id: string;
	teacher: boolean;
	main_teacher: boolean;
}

export default Admin;

// How tf is this so long - Lukas
// Because it's not made in fresh :trojker: - Bloxs
// :doubt: - Lukas
// This is 2,700 lines long, and contains not one useful comment - Bill

Admin.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

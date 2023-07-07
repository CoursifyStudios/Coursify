import { Tab } from "@headlessui/react";
import { CheckIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import uploadImage from "@/public/svgs/add-files.svg";
import { Popup } from "@/components/misc/popup";
import { Database } from "@/lib/db/database.types";
import { UsersResponse, getUsers } from "@/lib/db/admin";
import { useRouter } from "next/router";

type ImportedUser = {
	first_name: string;
	last_name: string;
	email: string;
	grad_year: number | null;
	parent: boolean;
	student_email: string | null;
}[];

const Admin: NextPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const user = useUser();
	const [searchOpen, setSearchOpen] = useState(false);
	const [uploadOpen, setUploadOpen] = useState(false);
	const [hovering, setHovering] = useState(false);
	const supabase = useSupabaseClient<Database>();
	const [users, setUsers] = useState<
		{
			id: string;
			full_name: string;
			email: string | null;
			year: string | null;
			bio: string | null;
			phone_number: number | null;
		}[]
	>();
	const [uploadUsers, setUploadUsers] = useState<ImportedUser>([
		{
			first_name: "Steve",
			last_name: "Huffman",
			email: "steve@ex.com",
			grad_year: 2092,
			parent: false,
			student_email: null,
		},
		{
			first_name: "Christian",
			last_name: "Selig",
			email: "chris@ex.com",
			grad_year: null,
			parent: true,
			student_email: "steve@ex.com",
		},
	]);
	const [uploaded, setUploaded] = useState(false);
	const [name, setName] = useState<string>();

	useEffect(() => {
		(async () => {
			if (!user || !id || !supabase) return;
			const { data } = await getUsers(
				supabase,
				1,
				25,
				typeof id == "string" ? id : ""
			);
			if (data) {
				setUsers(data.users);
				setName(data.name);
			}
		})();
	}, [id, supabase, user]);

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
							student_email,
						] = user;

						users.push({
							first_name,
							last_name,
							email,
							grad_year: parseInt(grad_year),
							parent: parent == "true",
							student_email:
								student_email == "null" ||
								student_email == "" ||
								student_email == undefined
									? null
									: student_email,
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
								Members
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
											<p>Student email</p>
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
													<p>{u.student_email ?? "NULL"}</p>
												</div>
											</>
										))}
									</div>
									{uploaded ? (
										<>Insert confirm and cancel and stuff button here</>
									) : (
										<>
											<p className="text-sm italic mt-1">
												All other columns will be ignored
											</p>
											<div className="group  mt-8 flex h-24 grow flex-col cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 transition hover:border-solid hover:bg-gray-50 hover:text-black dark:hover:bg-neutral-950 dark:hover:text-white">
												<h3 className="text-lg font-medium transition">
													Upload File
												</h3>
												<p className="text-sm">
													Drop a file or click anywhere to select
												</p>
											</div>
										</>
									)}
								</div>
							</Popup>
							<div className="bg-gray-200 rounded-2xl h-36 mt-2 flex items-center justify-center"></div>
							<div className="bg-gray-200 rounded-2xl h-36 mt-2 flex items-center justify-center"></div>
						</div>
						<div className="flex my-2">
							<div
								className={` relative flex grow items-center pr-2 max-w-[24rem]`}
							>
								<input
									type="text"
									className="!rounded-xl grow py-1.5 placeholder:dark:text-gray-400"
									onClick={() => setSearchOpen(true)}
									onBlur={() => setSearchOpen(false)}
									placeholder="Search users..."
								/>
								<MagnifyingGlassIcon className="absolute right-6 h-4 w-4" />
							</div>
						</div>
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
								<p>Student email</p>
							</div>
							{users ? (
								users.map((user, id) => (
									<div
										className=" [&>p]:px-2.5 [&>p]:py-2 divide-x flex [&>p]:w-full [&>p]:truncate [&>p]:whitespace-nowrap [&>p]:overflow-hidden "
										key={user.id}
									>
										<p className="grid place-items-center min-w-[3rem] max-w-[3rem]">
											<div
												className={`checkbox h-5 min-w-[1.25rem] rounded border-2 border-gray-300 transition  ${"dark:bg-neutral-950"}`}
											>
												{/* <CheckIcon /> */}
											</div>
										</p>
										<p>{user.id}</p>
										<p>{user.full_name}</p>
										<p>{user.email}</p>
										<p>{user.year}</p>
										<p>Coming Soon</p>
										<p>Coming Soon</p>
									</div>
								))
							) : (
								<div>loading</div>
							)}
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

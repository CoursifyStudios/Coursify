import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import { getClass, ClassResponse, updateClass } from "../../lib/db/classes";
import { Database, Json } from "../../lib/db/database.types";
import exampleClassImg from "../../public/example-img.jpg";
import CircleCounter from "../../components/misc/circleCounter";
import Link from "next/link";
import { AssignmentPreview } from "../../components/complete/assignments";
import { ColoredPill, CopiedHover } from "../../components/misc/pill";
import { AcademicCapIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { useTabs } from "../../lib/tabs/handleTabs";
import Editor from "../../components/editors/richeditor";
import { EditorState } from "lexical";

const Class: NextPage = () => {
	const router = useRouter();
	const { classid } = router.query;
	const user = useUser();
	const supabase = useSupabaseClient<Database>();
	const [data, setData] = useState<ClassResponse>();
	const [grade, setGrade] = useState<number>();
	const [isTeacher, setIsTeacher] = useState<boolean>();
	const { newTab } = useTabs();
	const [editable, setEditable] = useState(false);
	const [editorState, setEditorState] = useState<EditorState>();
	const [edited, setEdited] = useState(false);

	const updateEditorDB = async () => {
		setEdited(true);

		const newLongDescription = editorState?.toJSON();
		console.log(newLongDescription);
		if (classid != undefined && !Array.isArray(classid) && newLongDescription) {
			console.log("fired");
			const data = await updateClass(supabase, classid, {
				full_description: newLongDescription as unknown as Json,
			});
			console.log(data);
		}
	};

	useEffect(() => {
		(async () => {
			if (user && typeof classid == "string") {
				const data = await getClass(supabase, classid);
				setData(data);
				if (data.data && Array.isArray(data.data.users_classes)) {
					//grades are temporarily done like this until we figure out assignment submissions
					setGrade(
						data.data.users_classes.find((v) => v.user_id == user.id)?.grade
					);
					setIsTeacher(
						data.data.users_classes.find((v) => v.user_id == user.id)?.teacher
					);
				}
			}
		})();
		setEdited(false);
		setEditorState(undefined);
	}, [user, supabase, classid]);

	if (!data) return <div>loading data rn, wait pls ty</div>;

	return (
		<div className="mx-auto my-10 w-full max-w-screen-xl">
			<div className="relative mb-6 h-48 w-full">
				<Image
					src={exampleClassImg}
					alt="Example Image"
					className="rounded-xl object-cover object-center"
					fill
				/>
				<h1 className="title absolute  bottom-5 left-5 !text-4xl text-gray-200">
					{data.data && data.data.name}
				</h1>
			</div>
			<div className="flex">
				<Tab.Group as="div" className="flex grow flex-col">
					<Tab.List as="div" className="mx-auto mb-6 flex space-x-6">
						<Tab as={Fragment}>
							{({ selected }) => (
								<div
									className={`flex cursor-pointer items-center rounded-md py-0.5 px-2.5 focus:outline-none ${
										selected
											? "bg-gray-50 shadow-md shadow-black/25  "
											: "bg-gray-200"
									} text-lg font-semibold `}
								>
									Home
								</div>
							)}
						</Tab>
						<Tab as={Fragment}>
							{({ selected }) => (
								<div
									className={`flex cursor-pointer items-center rounded-md py-0.5 px-2.5 focus:outline-none ${
										selected
											? "bg-gray-50 shadow-md shadow-black/25 "
											: "bg-gray-200"
									} text-lg font-semibold `}
								>
									Announcements
								</div>
							)}
						</Tab>
						<Tab as={Fragment}>
							{({ selected }) => (
								<div
									className={`flex cursor-pointer items-center rounded-md py-0.5 px-2.5 focus:outline-none ${
										selected
											? "bg-gray-50 shadow-md  shadow-black/25 "
											: "bg-gray-200"
									} text-lg font-semibold `}
								>
									Members
								</div>
							)}
						</Tab>
					</Tab.List>
					<Tab.Panels>
						<Tab.Panel>
							<div className="flex">
								<ColoredPill color="green">Test</ColoredPill>
							</div>
							{data.data?.full_description ||
							(editorState && edited && !data.data?.full_description) ||
							editable ? (
								<div className="group relative">
									<Editor
										editable={editable}
										initialState={data.data?.full_description}
										updatedState={edited ? editorState : undefined}
										updateState={setEditorState}

										//className=" "
									/>
									{isTeacher &&
										(!editable ? (
											<div
												onClick={() => setEditable(true)}
												className="brightness-hover absolute right-2 top-2 z-10 flex cursor-pointer rounded-lg bg-gray-200 px-2.5 py-1 font-semibold opacity-0 transition group-hover:opacity-100"
											>
												Edit
											</div>
										) : (
											<div
												onClick={() => {
													setEditable(false);
													updateEditorDB();
												}}
												className="brightness-hover absolute right-2 bottom-2 z-10 flex cursor-pointer rounded-lg bg-gray-200 px-2.5 py-1 font-semibold"
											>
												Save
											</div>
										))}
								</div>
							) : (
								isTeacher && (
									<div onClick={() => setEditable(true)}>
										<ColoredPill
											color="gray"
											className="mt-2 cursor-pointer"
											hoverState
										>
											Add a class description
										</ColoredPill>
									</div>
								)
							)}
						</Tab.Panel>
						<Tab.Panel>announcements here</Tab.Panel>
						<Tab.Panel>
							<div className="grid grid-cols-3 gap-4">
								{data.data?.users && Array.isArray(data.data?.users) ? (
									data.data?.users.map((user, i) => (
										<Link
											className="brightness-hover flex rounded-xl bg-gray-200 p-6"
											key={i}
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
												{data.data.users_classes &&
													Array.isArray(data.data.users_classes) && // based on my testing it will always return an array, doing this to make ts happy
													data.data.users_classes.find(
														(userValue) =>
															userValue.teacher && user.id == userValue.user_id
													) && (
														<div className="absolute -bottom-1 -right-1  flex rounded-full bg-yellow-100 p-0.5">
															<AcademicCapIcon className="h-4 w-4 text-yellow-600" />
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
									))
								) : (
									<div className="rounded-xl bg-gray-200 p-4">
										An error occured
									</div>
								)}
							</div>
						</Tab.Panel>
					</Tab.Panels>
				</Tab.Group>
				<section className="sticky top-0 ml-8 w-[20.5rem] shrink-0">
					<div>
						<h2 className="title">Grade</h2>
						<div className="mt-6 rounded-xl bg-gray-200 p-4">
							<CircleCounter amount={grade} max={100} />
						</div>
					</div>
					<div className="space-y-4">
						<h2 className="title mt-8 mb-6">Assignments</h2>
						{Array.isArray(data.data?.assignments) &&
							user &&
							data.data?.assignments.map((assignment) => (
								<Link
									key={assignment.id}
									className=" brightness-hover flex rounded-xl bg-gray-200 p-3"
									href={"/assignments/" + assignment.id}
								>
									<AssignmentPreview
										id={assignment.id}
										supabase={supabaseClient}
										userId={user.id}
										name={assignment.name}
										desc={assignment.description}
										starred={false}
										due={new Date(1667840443856)}
									/>
								</Link>
							))}
					</div>
				</section>
			</div>
		</div>
	);
};

export default Class;

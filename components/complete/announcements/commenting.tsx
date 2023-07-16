import { Menu } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
	AnnouncementType,
	editAnnouncement,
	postCommentOrReply,
} from "../../../lib/db/announcements";
import { howLongAgo } from "../../../lib/misc/dates";
import { useTabs } from "../../../lib/tabs/handleTabs";
import { Button } from "../../misc/button";

export const Comment = ({
	id,
	author,
	time,
	content,
	users,
	communityid,
	type,
}: {
	author: string;
	time: string;
	content: string;
	users: {
		full_name: string;
		avatar_url: string;
	};
	communityid: string;
	id: string;
	type: AnnouncementType;
}) => {
	const supabase = useSupabaseClient();
	const user = useUser();
	const { newTab } = useTabs();
	const [text, setText] = useState(content);
	// const [showReplying, setShowReplying] = useState(false); not prod ready
	const [editing, setEditing] = useState(false);
	return (
		<div className="ml-4">
			<div className="flex items-center pt-1 ">
				<Link
					href={"/profile/" + author}
					className="inline-flex shrink-0 items-center rounded-full px-1 py-0.5 hover:bg-gray-300"
					onClick={() =>
						newTab(
							"/profile/" + author,
							users.full_name.split(" ")[0] + "'s Profile"
						)
					}
				>
					<Image
						src={users.avatar_url}
						alt="User image"
						className="h-5 w-5 rounded-full"
						referrerPolicy="no-referrer"
						width={20}
						height={20}
					/>
					<p className="ml-1.5 mr-1 font-semibold text-gray-700">
						{users.full_name}
					</p>
				</Link>
				<p className="pl-1.5 text-gray-600 dark:text-gray-400">{time}</p>
                {/* This is not functional yet, so goodbye */}
				{/* {user && user.id == author && (
					<Menu>
						<Menu.Button className="ml-auto">
							<EllipsisVerticalIcon className="w-5"></EllipsisVerticalIcon>
						</Menu.Button>
						<div className="absolute z-50 ml-72 mt-14">
							<Menu.Items
								as="div"
								className="relative flex w-48 flex-col rounded-xl bg-gray-200/75 px-2 py-2 shadow-xl backdrop-blur-xl"
							>
								<Menu.Item
									as="div"
									className="p-1 font-medium"
									onClick={() => setEditing(true)}
								>
									Edit
								</Menu.Item>
								<Menu.Item as="div" className="p-1 font-medium">
									Share
								</Menu.Item>
								<Menu.Item as="div" className="p-1 font-medium">
									Delete
								</Menu.Item>
							</Menu.Items>
						</div>
					</Menu>
				)} */}
			</div>
			{editing ? (
				<Formik
					initialValues={{
						content: text,
					}}
					onSubmit={async (formData) => {
						const test = await editAnnouncement(
							supabase,
							//kind of confusing but a comment's content uses the title field
							{ id: id, author: user!.id, title: content, clone_id: null },
							{ title: formData.content, content: null }
						);
						setEditing(false);
						setText(formData.content);
					}}
				>
					{({ values }) => (
						<Form className="focus:outline-none">
							<label htmlFor="content">
								<Field
									component="textarea"
									name="content"
									type="text"
									className="min-h-[2.5rem] w-full resize-y border-none bg-gray-300 px-4 py-2.5 !ring-0 dark:placeholder:text-gray-400"
									placeholder="Enter your revised comment here"
									autoFocus
								></Field>
							</label>
							<ErrorMessage name="content" />
							<div className="m-1 flex justify-end gap-2">
								<Button
									className="brightness-hover transition hover:bg-red-300"
									onClick={() => setEditing(false)}
								>
									Cancel
								</Button>
								<button
									className={`rounded-md bg-blue-500 px-4 py-1 font-semibold text-white ${
										values.content.length < 1
											? "cursor-not-allowed brightness-75"
											: "brightness-hover"
									}`}
									type="submit"
								>
									Post
								</button>
							</div>
						</Form>
					)}
				</Formik>
			) : (
				<p>{text}</p>
			)}
            {/* Replying UI is below. Replying is coming later! so uh. Yeah */}
{/* 
			<button
				className="ml-2"
				onClick={() => {
					setShowReplying(true);
				}}
			>
				<p>{showReplying ? "Replying to " + users.full_name : "Reply"}</p>
			</button>
			{showReplying && (
				<Commenting
					communityid={communityid}
					parentID={id!}
					showMe={setShowReplying}
				></Commenting>
			)} */}
		</div>
	);
};

export const Commenting = ({
	communityid,
	parentID,
	showMe,
}: {
	communityid: string;
	parentID: string;
	showMe?: (value: boolean) => void;
}) => {
	const supabase = useSupabaseClient();
	const user = useUser();
	const [showCommenting, setShowCommenting] = useState(false);
	const [tempComments, setTempComments] = useState<
		{
			id: string;
			author: string;
			time: string;
			content: string;
			users: {
				full_name: string;
				avatar_url: string;
			};
		}[]
	>([]);

	return (
		<>
			{showCommenting ? (
				user && (
					//Find something else to use than formik maybe, because this stupid one-line thing is awful
					<Formik
						initialValues={{
							content: "",
						}}
						onSubmit={async (formData) => {
							setShowCommenting(false);
							const test = await postCommentOrReply(
								supabase,
								user.id,
								communityid,
								parentID,
								formData.content,
								AnnouncementType.COMMENT
							);
							setTempComments(
								tempComments.concat({
									//possibly a sumb idea
									id: test.data!.id,
									author: user.id,
									time: test.data?.time
										? howLongAgo(test.data.time)
										: "Posted just now",
									content: formData.content,
									users: {
										full_name: user.user_metadata.name,
										avatar_url: user.user_metadata.picture,
									},
								})
							);
						}}
					>
						{({ values }) => (
							<Form className="focus:outline-none">
								<label htmlFor="content">
									<Field
										component="textarea"
										name="content"
										type="text"
										className="mt-2 min-h-[2.5rem] w-full resize-y rounded-3xl border-none bg-gray-300 px-4 py-2 !ring-0 dark:placeholder:text-gray-400"
										placeholder="Add a comment..."
										autoFocus
									></Field>
								</label>
								<ErrorMessage name="content" />
								<div className="m-1 flex justify-end gap-2">
									<Button
										className="brightness-hover transition hover:bg-red-300"
										onClick={() => {
											setShowCommenting(false);
											if (showMe) showMe(false);
										}}
									>
										Cancel
									</Button>
									<button
										className={`rounded-md bg-blue-500 px-4 py-1 font-semibold text-white ${
											values.content.length < 1
												? "cursor-not-allowed brightness-75"
												: "brightness-hover"
										}`}
										type="submit"
									>
										Post
									</button>
								</div>
							</Form>
						)}
					</Formik>
				)
			) : (
				<div className="my-2 flex">
					<div
						className=" h-10 flex-grow items-center rounded-full bg-gray-300 p-2"
						tabIndex={0}
						onClick={() => setShowCommenting(true)}
					>
						<p className="ml-1.5 text-gray-400">Add a comment...</p>
					</div>
				</div>
			)}
			{tempComments.reverse().map((comment) => (
				<Comment
					key={comment.id}
					id={comment.id}
					author={comment.author}
					time={comment.time}
					content={comment.content}
					users={comment.users}
					communityid={communityid}
					type={AnnouncementType.COMMENT}
				></Comment>
			))}
		</>
	);
};

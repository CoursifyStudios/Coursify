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
import MenuSelect from "@/components/misc/menu";
import {
	EllipsisVerticalIcon,
	PencilIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";
import { Delete } from "./delete";

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
	const [errorText, setErrorText] = useState("");
	const [deleted, setDeleted] = useState(false);
	const [showDeleting, setShowDeleting] = useState(false);
	if (!deleted) {
		return (
			<div className="ml-4">
				<Delete
					open={showDeleting}
					setOpen={setShowDeleting}
					setDeleted={setDeleted}
					supabase={supabase}
					announcement={{
						id: id,
						author: author,
						title: content,
						content: null,
						time: time,
						type: type,
						clone_id: null,
						users: users,
					}}
					classID={communityid}
				/>
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
							className="h-5 w-5 rounded-full object-cover"
							referrerPolicy="no-referrer"
							width={20}
							height={20}
						/>
						<p className="ml-1.5 mr-1 font-semibold text-gray-700">
							{users.full_name}
						</p>
					</Link>
					<p className="pl-1.5 text-gray-600 dark:text-gray-400">{time}</p>
					{user && author == user.id && (
						<MenuSelect
							items={[
								{
									content: (
										<>
											{" "}
											Edit <PencilIcon className="h-5 w-5" />{" "}
										</>
									),
									onClick: () => {
										setEditing(true);
									},
								},
								{
									content: (
										<>
											{" "}
											Delete <TrashIcon className="h-5 w-5" />{" "}
										</>
									),
									onClick: () => {
										setShowDeleting(true);
									},
								},
							]}
						>
							<div className=" p-2 hover:bg-gray-200">
								<EllipsisVerticalIcon className="h-6 w-6" />
							</div>
						</MenuSelect>
					)}
				</div>
				{editing ? (
					<Formik
						initialValues={{
							content: text,
						}}
						onSubmit={async (formData) => {
							setErrorText("");
							const newEditedAnnouncement = await editAnnouncement(
								supabase,
								//kind of confusing but a comment's content uses the title field
								{ id: id, author: user!.id, title: content, clone_id: null },
								{ title: formData.content, content: null }
							);
							if (newEditedAnnouncement.error) {
								//TODO: better error handling
								setErrorText(
									"Something went wrong, and your comment could not be edited"
								);
							} else {
								setErrorText("");
								setEditing(false);
								setText(formData.content);
							}
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
	} else {
		return null;
	}
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
	const [errorText, setErrorText] = useState("");

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
							setErrorText("");
							const dBResponse = await postCommentOrReply(
								supabase,
								user.id,
								communityid,
								parentID,
								formData.content,
								AnnouncementType.COMMENT
							);
							if (dBResponse.error) {
								setErrorText("Error: failed to post comment");
							} else {
								setErrorText("");
								setShowCommenting(false);

								setTempComments(
									tempComments.concat({
										//possibly a dumb idea
										id: dBResponse.data!.id,
										author: user.id,
										time: dBResponse.data?.time
											? howLongAgo(dBResponse.data.time)
											: "Posted just now",
										content: formData.content,
										users: {
											full_name: user.user_metadata.name,
											avatar_url: user.user_metadata.picture,
										},
									})
								);
							}
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
								<div className="m-1 flex gap-2">
									<p className="text-red-500">{errorText}</p>
									<div className="flex ml-auto">
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

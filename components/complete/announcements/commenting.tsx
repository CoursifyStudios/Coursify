import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { postComment } from "../../../lib/db/announcements";
import { howLongAgo } from "../../../lib/misc/dates";
import { useTabs } from "../../../lib/tabs/handleTabs";
import { Button } from "../../misc/button";

export const Comment = ({
	id,
	author,
	time,
	content,
	users,
}: {
	author: string;
	time: string;
	content: string;
	users: {
		full_name: string;
		avatar_url: string;
	};
	id?: string;
}) => {
	const { newTab } = useTabs();
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
			</div>
			<p>{content}</p>
		</div>
	);
};

export const Commenting = ({
	communityid,
	announcementid,
}: {
	communityid: string;
	announcementid: string;
}) => {
	const supabase = useSupabaseClient();
	const user = useUser();
	const [showCommenting, setShowCommenting] = useState(false);
	const [tempComments, setTempComments] = useState<
		{
			id?: string;
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
							const test = await postComment(
								supabase,
								user.id,
								communityid,
								announcementid,
								formData.content
							);
							setTempComments(
								tempComments.concat({
									id: test.data?.id,
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
										onClick={() => setShowCommenting(false)}
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
				></Comment>
			))}
		</>
	);
};

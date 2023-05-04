import { ErrorMessage, Field, Form, Formik, useFormikContext } from "formik";
import { postComment } from "../../../lib/db/announcements";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { Button } from "../../misc/button";
import Link from "next/link";
import { useTabs } from "../../../lib/tabs/handleTabs";
import { howLongAgo } from "../../../lib/misc/dates";
import Loading from "../../misc/loading";

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
		<div>
			<div className="flex items-center pt-1">
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
					<img src={users.avatar_url} alt="" className="h-5 w-5 rounded-full" />
					<p className="ml-1.5 mr-1 font-semibold text-neutral-700">
						{users.full_name}
					</p>
				</Link>
				<p className="pl-1.5 text-gray-600">{time}</p>
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
	const [loading, setLoading] = useState(false);
	const [content, setContent] = useState("");
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

	// I actually despise the fact that I'm using this, yay Formik!
	const FormObserver: React.FC = () => {
		const { values } = useFormikContext();

		useEffect(() => {
			setContent((values as { content: string }).content);
		}, [values]);

		return null;
	};
	return (
		<div>
			{showCommenting ? (
				<div className="rounded-lg bg-gray-300 p-1">
					{user && (
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
							<Form className="focus:outline-none">
								<label htmlFor="content">
									<Field
										component="textarea"
										name="content"
										type="text"
										className="w-full resize-y rounded-2xl border-none bg-gray-300 p-1 !ring-0"
										autoFocus
									></Field>
								</label>
								<ErrorMessage name="content"></ErrorMessage>
								<FormObserver />

								<div className="m-1 flex justify-end gap-2">
									<Button
										className="brightness-hover transition hover:bg-red-300"
										onClick={() => setShowCommenting(false)}
									>
										Cancel
									</Button>
									<button
										className={`rounded-md bg-blue-500 px-4 py-1 font-semibold text-white ${
											content.length < 1
												? "cursor-not-allowed brightness-75"
												: "brightness-hover"
										}`}
										type="submit"
									>
										Post
									</button>
								</div>
							</Form>
						</Formik>
					)}
				</div>
			) : (
				<div className="my-2 flex">
					<div
						className="mr-6 flex-grow items-center rounded-full bg-gray-300 p-1"
						tabIndex={0}
						onClick={() => setShowCommenting(true)}
					>
						<p className="ml-1.5 p-1">Insert response here</p>
					</div>
				</div>
			)}

			{loading && <Loading></Loading>}
			<div className="ml-2 space-y-1">
				{tempComments.reverse().map((comment) => (
					<Comment
						id={comment.id}
						author={comment.author}
						time={comment.time}
						content={comment.content}
						users={comment.users}
					></Comment>
				))}
			</div>
		</div>
	);
};

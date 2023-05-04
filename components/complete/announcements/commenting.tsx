import { Field, Form, Formik } from "formik";
import { postComment, CommentType } from "../../../lib/db/announcements";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { Button } from "../../misc/button";
import Link from "next/link";
import { useTabs } from "../../../lib/tabs/handleTabs";
import { howLongAgo } from "../../../lib/misc/dates";

export const Comment = ({
	id,
	time,
	content,
	users,
}: {
	id: string;
	time: string;
	content: string;
	users: {
		id: string;
		full_name: string;
		avatar_url: string;
	};
}) => {
	const { newTab } = useTabs();
	return (
		<div>
			{/* <div className="flex items-center pt-1">
        <Link
            href={"/profile/" + users.id}
            className="inline-flex shrink-0 items-center rounded-full px-1 py-0.5 hover:bg-gray-300"
            onClick={() =>
                newTab(
                    "/profile/" + users.id,
                    users.full_name.split(" ")[0] +
                        "'s Profile"
                )
            }
        >
            <img
                src={users.avatar_url}
                alt=""
                className="h-5 w-5 rounded-full"
            />
            <p className="ml-1.5 mr-1 font-semibold text-neutral-700">
                {users.full_name}
            </p>
        </Link>
        <p className="pl-1.5 text-gray-600">
            {howLongAgo(time)}
        </p>
    </div> */}
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
	if (!showCommenting) {
		return (
			<div className="mt-2 flex">
				<div
					className="mr-6 flex-grow items-center rounded-full bg-gray-300 p-1"
					tabIndex={0}
					onClick={() => setShowCommenting(true)}
				>
					<p className="ml-1.5 p-1">Insert response here</p>
				</div>
			</div>
		);
	}
	return (
		<div className="rounded-lg bg-gray-300 p-1">
			{user && (
				//Find something else to use than formik maybe, because this stupid one-line thing is awful
				<Formik
					initialValues={{
						content: "",
					}}
					onSubmit={async (formData) => {
						const test = await postComment(
							supabase,
							user.id,
							announcementid,
							formData.content
						);
					}}
				>
					<Form>
						<label htmlFor="content">
							<Field
								name="content"
								type="text"
								className="w-full rounded-2xl border-gray-300 bg-gray-300"
							></Field>
						</label>
					</Form>
				</Formik>
			)}

			<div className="m-1 flex justify-end gap-2">
				<Button
					className="brightness-hover transition hover:bg-red-300"
					onClick={() => setShowCommenting(false)}
				>
					Cancel
				</Button>
				<Button className="text-white" color="bg-blue-500">
					Post
				</Button>
			</div>
		</div>
	);
};

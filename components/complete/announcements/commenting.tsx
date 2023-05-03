import { Field, Form, Formik } from "formik";
import { postComment } from "../../../lib/db/announcements";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { Button } from "../../misc/button";

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
				<Formik
					initialValues={{
						content: "",
					}}
					onSubmit={async (formData) => {
						postComment(supabase, user.id, announcementid, formData.content);
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

			<div className="flex justify-end gap-2 m-1">
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


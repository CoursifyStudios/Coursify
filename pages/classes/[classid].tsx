import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { stringify } from "querystring";
import { useEffect, useState } from "react";
import { Assignment, newAssignment } from "../../lib/db/assignments";
import { getClass, ClassResponse } from "../../lib/db/classes";
import { Database } from "../../lib/db/database.types";

const Class: NextPage = () => {
	const router = useRouter();
	const { classid } = router.query;
	const user = useUser();
	const supabaseClient = useSupabaseClient<Database>();
	const [data, setData] = useState<ClassResponse>();
	const [d, setD] = useState();
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		(async () => {
			if (user && typeof classid == "string") {
				const data = await getClass(supabaseClient, classid);
				setData(data);
			}
		})();
		// (async () => {
		// 	if (user && typeof classid == "string") {
		// 		const data = await updateClass(supabaseClient, Number.parseInt(classid as string));
		// 		console.log(data);
		// 	}
		// })();
	}, [user, supabaseClient, classid]);

	const createAssignment = async (data: Assignment["data"]) => {
		const assign = await newAssignment(data, classid as string);
		if (!assign.success && assign.error) {
			alert(assign.error.message);
			console.log(assign.error);
			setSubmitting(false);
		} else {
			alert("created assignment");
			setSubmitting(false);
		}
	};

	if (!data) return <div>loading data rn, wait pls ty</div>;

	return (
		<div className="mx-auto my-10 w-full max-w-screen-md">
			<h1 className="mb-4 text-2xl font-bold">
				Class Page: {data.data && data.data.name}
			</h1>

			<section className="my-6">
				<h2 className="text-lg font-semibold">Assignments:</h2>

				{data.data &&
					data.data.assignments &&
					Array.isArray(data.data.assignments) &&
					data.data.assignments.map((assignment, i) => (
						<div className="flex flex-col" key={i}>
							Assignment:
							<p>{assignment.name}</p>
							{assignment.description}
						</div>
					))}
			</section>
			<section className="my-6">
				<h2 className="mb-4 text-lg font-semibold">New Assignment:</h2>
				<Formik
					initialValues={{ name: "", description: "" }}
					onSubmit={(v) => {
						setSubmitting(true),
							createAssignment({ name: v.name, description: v.description });
					}}
				>
					<Form className="flex flex-col">
						<label htmlFor="name">Name</label>
						<Field name="name" type="text" />
						<ErrorMessage name="name" />
						<label htmlFor="description">Desc</label>
						<Field name="description" type="text" />
						<ErrorMessage name="description" />
						<button
							type="submit"
							className="mr-auto mt-4 bg-black py-2 px-4 text-white"
						>
							New assignment
						</button>
					</Form>
				</Formik>
				submitting: {submitting ? "TRUE" : "FALSE"}
			</section>
		</div>
	);
};

export default Class;

// to-do: send new assignment for server, get id back, then write to classes_assignments
// future: create a functiuon that I can call that does this for me. faster + more reliable if the user exists page

import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import { getClass, ClassResponse } from "../../lib/db/classes";
import { Database } from "../../lib/db/database.types";
import exampleClassImg from "../../public/example-img.jpg";

const Class: NextPage = () => {
	const router = useRouter();
	const { classid } = router.query;
	const user = useUser();
	const supabaseClient = useSupabaseClient<Database>();
	const [data, setData] = useState<ClassResponse>();
	const [d, setD] = useState();

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
									className={`flex cursor-pointer items-center rounded-md py-0.5 px-2 ${
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
									className={`flex cursor-pointer items-center rounded-md py-0.5 px-2.5 ${
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
									className={`flex cursor-pointer items-center rounded-md py-0.5 px-2.5 ${
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
				</Tab.Group>
				<section className="sticky top-0 w-72">
					<div>
						<h2 className="title">Grades</h2>
						<div className="mt-6 rounded-xl bg-gray-200 p-4"></div>
					</div>
				</section>
			</div>
		</div>
	);
};

export default Class;

// to-do: send new assignment for server, get id back, then write to classes_assignments
// future: create a functiuon that I can call that does this for me. faster + more reliable if the user exists page

import { GrammarlyEditorPlugin } from "@grammarly/editor-sdk-react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import { UserDataType, getUserData, updateBio } from "../../../lib/db/settings";
import { Button } from "../../misc/button";
import * as Yup from "yup";
import Loading from "@/components/misc/loading";

const Profile: NextPage = () => {
	const supabase = useSupabaseClient();
	const user = useUser();
	const [userData, setUserData] = useState<UserDataType>();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>();
	useEffect(() => {
		(async () => {
			if (user && !userData) {
				const profile = await getUserData(supabase, user.id);
				setUserData(profile);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	const submitForm = async (values: { bio: string | null }) => {
		if (!user) {
			setError("No user found");
			return;
		}
		setLoading(true);
		const { error } = await updateBio(supabase, user.id, values.bio);

		setLoading(false);
		if (error) setError(error.message);
	};

	if (!userData) {
		return <div>loading</div>;
	}

	if (!userData.data) {
		return <div>error</div>;
	}

	return (
		<div>
			<div className="flex justify-between">
				<div className="flex items-center ">
					<Image
						src={userData.data.avatar_url}
						alt="Profile picture"
						referrerPolicy="no-referrer"
						className="h-40 w-40 rounded-full object-cover shadow-md shadow-black/25"
						height={90}
						width={90}
					/>
					<div className="ml-5">
						<p className="text-2xl font-bold">{userData.data.full_name}</p>
						<p className="text-xl">{userData.data.year}</p>
					</div>
				</div>
			</div>
			<div className="mt-3 flex space-x-8">
				<div>
					<h2 className="mb-1 text-xl font-medium">Email</h2>
					<div className="select-none rounded-md bg-backdrop-200 px-3 py-1.5 font-semibold">
						{userData.data.email}
					</div>
				</div>
			</div>
			<div className="mt-3">
				<Formik
					initialValues={{
						bio: userData.data.bio,
					}}
					validationSchema={Yup.object({
						bio: Yup.string().max(55),
					})}
					onSubmit={(values) => alert(JSON.stringify(values))}
				>
					{({ values, errors }) => (
						<Form>
							<label htmlFor="bio" className="flex flex-col">
								<h1 className="mb-1 text-xl font-medium">Bio</h1>
								<Field type="text" name="bio" className="w-full mb-1" />
								{values.bio ? (
									<p className="ml-auto text-sm">
										<span
											className={values.bio.length >= 55 ? "text-red-700" : ""}
										>
											{values.bio.length}
										</span>
										/55
									</p>
								) : (
									<p className="ml-auto text-sm">0/55</p>
								)}
							</label>
							<div className="justify-between items-center">
								<Button
									type="submit"
									className="mt-4 text-white"
									color="bg-blue-500"
									disabled={
										!values.bio ||
										values.bio == userData.data.bio ||
										Boolean(errors.bio) ||
										loading
									}
								>
									Save
								</Button>

								{loading && <Loading className="bg-gray-300" />}
							</div>
						</Form>
					)}
				</Formik>
				<p className="text-red-700">{error}</p>
			</div>
		</div>
	);
};

export default Profile;

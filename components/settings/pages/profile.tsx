import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Formik } from "formik";
import { NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import { UserDataType, getUserData } from "../../../lib/db/settings";
import { Button } from "../../misc/button";

const Profile: NextPage = () => {
	const supabase = useSupabaseClient();
	const user = useUser();
	const [userData, setUserData] = useState<UserDataType>();
	useEffect(() => {
		(async () => {
			if (user && !userData) {
				const profile = await getUserData(supabase, user.id);
				setUserData(profile);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

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
				<div>
					<Button type="submit">Save</Button>
				</div>
			</div>
			<div className="mt-3 flex space-x-8">
				<div>
					<h2 className="mb-1 text-xl font-medium">Email</h2>
					<div className="select-none rounded-md bg-gray-200 p-2 pr-10 font-semibold">
						{userData.data.email}
					</div>
				</div>
			</div>
			<div className="mt-3">
				<h1 className="mb-1 text-xl font-medium">Bio</h1>
				<Formik
					initialValues={{
						bio: userData.data.bio,
					}}
					onSubmit={(values) => alert(JSON.stringify(values))}
				>
					<textarea
						className="flex w-full resize-none rounded-md border border-gray-300 bg-backdrop/50 bg-gray-200 pb-2 focus:ring-1"
						name="bio"
						rows={4}
						maxLength={150}
					/>
				</Formik>
			</div>
		</div>
	);
};

export default Profile;

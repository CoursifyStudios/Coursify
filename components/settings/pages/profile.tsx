import { NextPage } from "next";
import { useEffect, useState } from "react";
import { UserDataType, getUserData } from "../../../lib/db/settings";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { Field, Form, Formik } from "formik";
import { Button } from "../../misc/button";

const Profile: NextPage<{}> = () => {
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
	}, [user]);

	if (!userData) {
		return <div>loading</div>;
	}

	if (!userData.data) {
		return <div>error</div>;
	}

	return (
		<div>
			<div className="flex items-center ">
				<Image
					src={userData.data.avatar_url}
					alt="Profile picture"
					referrerPolicy="no-referrer"
					className="w-40 rounded-full shadow-md shadow-black/25"
					height={90}
					width={90}
				/>
				<div className="ml-5">
					<p className="text-3xl font-bold">{userData.data.full_name}</p>
					<p className="text-xl">{userData.data.year}</p>
				</div>
			</div>
			<div className="mt-3">
				<h1 className="text-xl font-medium">Bio</h1>
				<Formik
					initialValues={{
						bio: userData.data.bio,
					}}
					onSubmit={(values) => alert(JSON.stringify(values))}
				>
					<Form>
						<Field name="bio" type="text" className="w-full text-sm" rows={5} />
						<Button type="submit">Submit</Button>
					</Form>
				</Formik>
			</div>
		</div>
	);
};

export default Profile;

import { NextPage } from "next";
import { useEffect, useState } from "react";
import { UserDataType, getUserData } from "../../../lib/db/settings";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";

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
			<h1 className="title mb-4">Profile</h1>
			<Image
				src={userData.data.avatar_url}
				alt="Profile picture"
				referrerPolicy="no-referrer"
				className="w-40 rounded-full shadow-md shadow-black/25"
				height={90}
				width={90}
			/>
		</div>
	);
};

export default Profile;

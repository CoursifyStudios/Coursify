import { NextPage } from "next";
import { useEffect, useState } from "react";
import { UserDataType, getUserData } from "../../../lib/db/settings";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

const Profile: NextPage<{}> = () => {
    const supabase = useSupabaseClient();
    const user = useUser();
	const [userData, setUserData] = useState<UserDataType>();
	useEffect(() => {
		(async () => {
            const data = await getUserData(supabase, user?.id!);
            setUserData(data);
        })();
	}, [user, userData]);
	return (
		<div>
			<span>{userData?.data?.full_name}</span>
		</div>
	);
};

export default Profile;


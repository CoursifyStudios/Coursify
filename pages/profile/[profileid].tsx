import { EnvelopeIcon } from "@heroicons/react/24/outline";
import type { NextComponentType } from "next";
import Image from "next/image";
import profileexample from "../../public/unnamed.jpg";
import { ReactNode, useEffect, useState } from "react";
import { Class } from "../../components/classes/class";
import { ProfilesResponse } from "../../lib/db/profiles";
import { getProfile } from "../../lib/db/profiles";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "../../lib/db/database.types";
import { useRouter } from "next/router";

export default function Profile() {
	const [profile, setProfile] = useState<ProfilesResponse>();
	const supabaseClient = useSupabaseClient<Database>();

	const router = useRouter();
	const { profileid } = router.query;

	useEffect(() => {
		(async () => {
			if (profileid) {
				const data = await getProfile(supabaseClient, profileid as string);
				setProfile(data);
			}
		})();
	}, [router, supabaseClient]);

	return (
		<div className="container mx-auto flex w-full flex-col p-2 sm:p-4 md:p-8 lg:flex-row lg:space-x-8 2xl:max-w-screen-xl">
			<div className="flex shrink-0 flex-col items-center rounded-md bg-gray-200 p-6 md:flex-row lg:h-[calc(100vh-8rem)] lg:w-72 lg:flex-col">
				<div className="flex flex-col items-center ">
					<Image
						className="h-40 w-40 rounded-full object-cover "
						src={profileexample}
						alt="Profile Picture"
						width={200}
						height={200}
					/>
					<h1 className="mt-5 break-words text-center text-3xl font-bold ">
						{profile?.data?.full_name}
					</h1>
					<h2 className="text-xl">2023</h2>
					<h2
						className="group relative mt-2 flex cursor-pointer items-center rounded-md bg-gray-300 py-0.5 px-2 text-sm font-medium"
						onClick={() => navigator.clipboard.writeText("amongus@gmail.com")}
					>
						<EnvelopeIcon className="mr-2 h-5 w-5 text-gray-800" />{" "}
						23jdoe@shcp.edu
						<div className="absolute -right-20 flex scale-0 group-focus:group-hover:scale-100">
							<div className="mx-auto rounded-md bg-blue-300 px-2 font-semibold text-blue-700">
								Copied!
							</div>
						</div>
					</h2>
				</div>
				<div className=" mt-5 hidden h-0.5 w-full bg-gradient-to-r from-transparent via-black to-transparent lg:block"></div>
				<div className="scrollbar-fancy scrollbar-show-hover mx-0 flex flex-col items-center overflow-y-auto md:mx-auto lg:mx-0 lg:mt-10">
					<h1 className="title mb-5">Achievements</h1>
					<div className=" grid grid-cols-1 gap-6 md:grid-cols-2">
						<Achievement
							icon={<EnvelopeIcon className="h-6 w-6" />}
							description="test"
							title="testing test testicles"
						/>
						<Achievement
							icon={<EnvelopeIcon className="h-6 w-6" />}
							description="test"
							title="testing test testicles"
						/>
						<Achievement
							icon={<EnvelopeIcon className="h-6 w-6" />}
							description="test"
							title="testing test testicles"
						/>
						<Achievement
							icon={<EnvelopeIcon className="h-6 w-6" />}
							description="test"
							title="testing test testicles"
						/>
						<Achievement
							icon={<EnvelopeIcon className="h-6 w-6" />}
							description="test"
							title="testing test testicles"
						/>
						<Achievement
							icon={<EnvelopeIcon className="h-6 w-6" />}
							description="test"
							title="testing test testicles"
						/>
					</div>
				</div>
			</div>

			<div className=" scrollbar-fancy mx-auto mt-8 shrink-0 overflow-y-auto  rounded-xl lg:mt-0 lg:h-[calc(100vh-8rem)]">
				<h2 className="title mb-4">Classes</h2>
				<div className="grid gap-8 md:grid-cols-2">
					<Class class={{ data: { name: "test" } }} />
					<Class class={{ data: { name: "test" } }} />
					<Class class={{ data: { name: "test" } }} />
					<Class class={{ data: { name: "test" } }} />
					<Class class={{ data: { name: "test" } }} />
					<Class class={{ data: { name: "test" } }} />
					<Class class={{ data: { name: "test" } }} />
					<Class class={{ data: { name: "test" } }} />
				</div>
			</div>
			<div className="scrollbar-fancy hidden w-full flex-col overflow-y-auto rounded-xl lg:h-[calc(100vh-8rem)] xl:flex">
				<h2 className="title mb-4">Groups</h2>
				<div className="flex flex-col gap-8">
					<Groups
						photo="/profileexample.jpg"
						title="Mr. Farrell's Counseling Students, Class of 2025"
						description="12345678912345"
					/>
					<Groups
						photo="/profileexample.jpg"
						title="Tedx"
						description="we talk about stuff sometimes"
					/>
					<Groups
						photo="/profileexample.jpg"
						title="Tedx"
						description="we talk about stuff sometimes"
					/>
					<Groups
						photo="/profileexample.jpg"
						title="Tedx"
						description="we talk about stuff sometimes like really boring shit"
					/>
				</div>
			</div>
		</div>
	);
}

const Achievement = ({
	icon,
	title,
	description,
}: {
	icon: ReactNode;
	title: string;
	description: string;
}) => {
	return (
		<div className="flex flex-col text-center">
			<div className="mx-auto rounded-full bg-white p-4">{icon}</div>
			<h3 className="mt-2 font-bold line-clamp-2 ">{title}</h3>
			<h4 className="text-sm line-clamp-2">{description}</h4>
		</div>
	);
};

const Groups = (props: {
	photo: string;
	title: string;
	description: string;
}) => {
	return (
		<div className="flex w-full items-center rounded-md bg-gray-200 p-4 transition duration-300 hover:shadow-lg hover:brightness-95 ">
			<Image
				width={100}
				height={100}
				className="mr-2 h-10 w-10 rounded-full object-cover"
				alt={"Groups image for " + props.title}
				src={props.photo}
			/>
			<div className="flex flex-col justify-center">
				<h3 className="text-l w-28 font-bold line-clamp-2 ">{props.title}</h3>
			</div>
		</div>
	);
};
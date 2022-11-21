import { EnvelopeIcon } from "@heroicons/react/24/outline";
import type { NextComponentType } from "next";
import Image from "next/image";
import profileexample from "../../public/profileexample.jpg";
import type { ReactNode } from "react";
import { Class } from "../../components/classes/class";

export default function Profile() {
	return (
		<div className="flex flex-grow space-x-8 p-8">
			<div className="flex w-96 flex-col items-center rounded-md bg-gray-200 p-8">
				<Image
					className="h-56 w-56 rounded-full object-cover "
					src={profileexample}
					alt="Profile Picture"
					width={200}
					height={200}
				/>
				<h1 className="mt-5 text-3xl font-bold line-clamp-2">Jane Doe</h1>
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
				<div className=" mt-5 h-0.5 w-full bg-gradient-to-r from-transparent via-black to-transparent"></div>
				<h1 className="l title	mt-10 mb-5">Achievements</h1>
				<div className="grid grid-cols-3 gap-6">
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

			<div className=" scrollbar-fancy h-[calc(100vh-8rem)] overflow-y-auto rounded-xl">
				<h2 className="title mb-4">Classes</h2>
				<div className="grid grid-cols-2 gap-8">
					<Class class={{ data: { name: "test" } }} />
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
			<div className="flex-1 rounded-md bg-gray-200">
				Variable with, fills space
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

const groups = (props: {
	photo: string;
	title: string;
	description: string;
}) => {
	return (
		<div className="rounded-md bg-gray-200 ">
			<div className="rounded-full">{props.photo}</div>
			<div className="flex-col">
				<h3 className="">{props.title}</h3>
				<p>{props.description}</p>
			</div>
		</div>
	);
};

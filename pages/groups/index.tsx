import { NextPage } from "next";
import Image from "next/image";
const groupDirecory: NextPage = () => {
	return (
		<div>
			{" "}
			<div className="mx-auto my-10 w-full max-w-screen-xl">
				<div className="mt-6 grid gap-6 md:grid-cols-3 xl:grid-cols-4 ">
					<Groups photo="" name="Testing" description="Testing this shit" />
					<Groups photo="" name="Testing" description="Testing this shit" />
					<Groups photo="" name="Testing" description="Testing this shit" />
					<Groups photo="" name="Testing" description="Testing this shit" />
					<Groups photo="" name="Testing" description="Testing this shit" />
					<Groups photo="" name="Testing" description="Testing this shit" />
					<Groups photo="" name="Testing" description="Testing this shit" />
				</div>
			</div>
		</div>
	);
};

const Groups = (props: {
	photo: string;
	name: string;
	description: string;
}) => {
	return (
		<div
			className={
				"flex w-[19rem] cursor-pointer flex-col rounded-xl bg-gray-200 transition duration-300 hover:shadow-lg hover:brightness-95 "
			}
		>
			<div className="relative h-32 ">
				<Image
					src="/example-img.jpg"
					alt="Example Image"
					className="rounded-t-xl object-cover object-center"
					fill
				/>
			</div>
			<div className="flex flex-grow flex-col p-4">
				<div className="flex items-start justify-between">
					<h3 className="break-words text-xl font-semibold line-clamp-2">
						{props.name}
					</h3>
				</div>
				<p>{props.description}</p>
			</div>
		</div>
	);
};

export default groupDirecory;

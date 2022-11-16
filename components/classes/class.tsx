import { Class } from "../../lib/db/classes";
import Image from "next/image";

export function Class(props: { class: Class }) {
	return (
		<div className="group flex w-[19rem] cursor-pointer  flex-col rounded-xl bg-gray-200 transition duration-300 hover:shadow-lg hover:brightness-95">
			<div className="relative h-32 ">
				<Image
					src="/example-img.jpg"
					alt="Example Image"
					className="rounded-t-xl object-cover object-center"
					fill
				/>
			</div>
			<div className="flex flex-grow flex-col  p-4">
				<div className="flex items-start justify-between">
					<h3 className="break-words text-xl font-semibold line-clamp-2">
						{props.class.data.name}
					</h3>
					<div className="ml-2 mt-1 shrink-0 rounded-full bg-blue-200 px-1.5 text-sm  font-bold text-blue-600">
						11:30 - 12:15
					</div>
				</div>
				<p>Teacher name</p>
				<div className="mt-auto">
					{/* <div className="mt-4 inline-flex rounded-md bg-blue-500 px-3 py-1 font-medium text-white transition duration-300 group-hover:bg-blue-600">
						View Class
					</div> */}
				</div>
			</div>
		</div>
	);
}

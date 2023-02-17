import { NextPage } from "next";
import Image from "next/image";
import exampleGroupImg from "../../public/example-img.jpg";
const sport: NextPage = () => {
	return (
		<div className="mx-auto my-10 w-full max-w-screen-xl">
			<div className="flex flex-col">
				<div className="relative mb-6 h-48 w-full">
					<Image
						src={exampleGroupImg}
						alt="Example Image"
						className="rounded-xl object-cover object-center"
						fill
					/>
					<h1 className="title absolute  bottom-5 left-5 !text-4xl text-gray-200">
						Swim Team
					</h1>
				</div>
				<h1 className="title">Weekly View</h1>
				<div className="flex h-64 flex-grow space-x-6 rounded-xl py-2">
					{[...new Array(5)].map((_, i) => (
						<div
							key={i}
							className="grow rounded-xl bg-gray-200 px-3 text-center text-gray-700"
						>
							<p className="mt-4">MON</p>
							<h2 className="title mb-6">16</h2>
							<div className="rounded-lg bg-green-200 py-0.5">
								<p className="text-green-600">Swim Practice</p>
							</div>
							<div className="my-1.5 rounded-lg  bg-blue-200 py-0.5">
								<p className="text-blue-600">Swim Practice</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default sport;

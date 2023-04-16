import { useRouter } from "next/router";

export default function Custom404() {
	const router = useRouter();

	return (
		<div className="flex flex-grow flex-col items-center justify-center">
			<div className="flex-row items-center justify-center rounded-md">
				<h1 className="pb-10 text-7xl sm:text-9xl font-extrabold">Whoops...</h1>
				<h2 className="mb-5 text-center text-xl">
					It doesnt seem like this page exists
				</h2>
			</div>

			<div
				onClick={() => router.push("/")}
				className="mt-8 cursor-pointer rounded-md bg-blue-500 py-2 px-5 font-medium text-gray-100 duration-500 hover:bg-blue-700"
			>
				Go back home
			</div>
		</div>
	);
}

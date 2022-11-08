import { useRouter } from "next/router";

export default function Custom404() {
	const router = useRouter();

	return (
		<div className="flex flex-grow flex-col items-center justify-center">
			<div className="flex items-center rounded-md bg-slate-300 p-10">
				<Whatever color="bg-yellow-400" />
				<h1 className=" ml-8 text-7xl font-extrabold ">404</h1>
			</div>

			<div
				onClick={() => router.push("/")}
				className="mt-8 cursor-pointer rounded-md bg-blue-500 py-2 px-5 font-medium text-gray-100 hover:bg-blue-300"
			>
				Back to home
			</div>
		</div>
	);
}
function Whatever(props: { color: string }) {
	return (
		<div className="relative">
			<div className={`h-8 w-8 animate-ping rounded-full ${props.color}`} />
			<div className="absolute inset-0 grid place-items-center">
				<div className={`h-8 w-8 rounded-full ${props.color}`} />
			</div>
		</div>
	);
}

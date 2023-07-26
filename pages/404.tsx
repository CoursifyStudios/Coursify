import Layout from "@/components/layout/layout";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { NextPageWithLayout } from "./_app";

const Custom404: NextPageWithLayout = () => {
	const router = useRouter();

	return (
		<div className="flex flex-grow flex-col items-center justify-center">
			<div className="flex-row items-center justify-center rounded-md">
				<h1 className="pb-10 text-7xl font-extrabold sm:text-9xl">Whoops...</h1>
				<h2 className="mb-5 text-center text-xl">
					That page could not be found
				</h2>
			</div>

			<div
				onClick={() => router.push("/")}
				className="mt-8 cursor-pointer rounded-md bg-blue-500 px-5 py-2 font-medium text-gray-100 duration-500 hover:bg-blue-700"
			>
				Go back home
			</div>
		</div>
	);
};

export default Custom404;

Custom404.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

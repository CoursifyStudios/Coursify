import Layout from "@/components/layout/layout";
import { useRouter } from "next/router";
import Image from "next/image";
import { useState } from "react";
import { ReactElement } from "react";
import { NextPageWithLayout } from "./_app";

const Custom404: NextPageWithLayout = () => {
	const router = useRouter();
	const [showCat, setShowCat] = useState(false);
	const [catCode, setCatCode] = useState(404);
	const [loading, setLoading] = useState(true);
	const validCodes = [
		100, 101, 102, 103, 200, 201, 202, 203, 204, 206, 207, 300, 301, 302, 303,
		304, 305, 307, 308, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411,
		412, 413, 414, 415, 416, 417, 418, 421, 422, 423, 424, 425, 426, 429, 431,
		444, 451, 497, 498, 499, 500, 501, 502, 503, 504, 506, 507, 508, 509, 510,
		511, 521, 522, 523, 525, 599,
	];

	return (
		<div className="flex flex-grow flex-col items-center justify-center">
			<div className="flex-row items-center justify-center rounded-md">
				{showCat ? (
					<>
						<Image
							onClick={() => {
								if (loading) return;
								setLoading(true);
								setCatCode(
									validCodes[Math.floor(Math.random() * validCodes.length)]
								);
							}}
							height={750}
							width={600}
							alt="Http Cat"
							src={`https://http.cat/${catCode}.jpg`}
							onLoad={() => setLoading(false)}
							className={`rounded-md ${loading ? "animate-pulse" : ""}`}
						/>
					</>
				) : (
					<>
						<h1
							onClick={() => {
								setLoading(true);
								setShowCat(true);
								setCatCode(404);
							}}
							className="pb-10 text-7xl font-extrabold sm:text-9xl"
						>
							Whoops...
						</h1>
					</>
				)}
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

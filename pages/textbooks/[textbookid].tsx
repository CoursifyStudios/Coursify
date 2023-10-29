import { useRouter } from "next/router";
import { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";
import Layout from "@/components/layout/layout";
import Image from "next/image";

const Textbook: NextPageWithLayout = () => {
	const router = useRouter();
	const { textbookid } = router.query;

	return (
		<div className="mx-auto mt-10">
			<div></div>
			<Image
				alt="a temporary test image"
				src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=3087&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
				width={192}
				height={256}
			/>
		</div>
	);
};

export default Textbook;

Textbook.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

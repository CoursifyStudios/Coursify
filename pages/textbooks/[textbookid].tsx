import { useRouter } from "next/router";
import { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";
import Layout from "@/components/layout/layout";

const Textbook: NextPageWithLayout = () => {
	const router = useRouter();
	const { textbookid } = router.query;

	return (
		<div className="mx-auto mt-10">
			<p>lol</p>
		</div>
	);
};

export default Textbook;

Textbook.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

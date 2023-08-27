import { NextPageWithLayout } from "./_app";
import Layout from "@/components/layout/layout";
import { ReactElement, Fragment } from "react";
import licenses from "../public/licenses.json";

const Acknowledgements: NextPageWithLayout = () => {
	return (
		<>
			<h1>Acknowledgements</h1>
			<h2>We use the following packages under these licenses:</h2>
			<div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{Object.entries(licenses).map(([license, packages]) => (
					<div key={license} className="w-auto">
						<p className="w-auto">{license}</p>

						{packages.map((pkg) => (
							<p key={pkg} className="ml-6">
								{pkg}
							</p>
						))}
					</div>
				))}
			</div>
		</>
	);
};

export default Acknowledgements;

Acknowledgements.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

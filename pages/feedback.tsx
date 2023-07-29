import Layout from "@/components/layout/layout";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { NextPageWithLayout } from "./_app";
import { EnvelopeIcon, EnvelopeOpenIcon } from "@heroicons/react/24/outline";

const Feedback: NextPageWithLayout = () => {
	return (
		<div className="flex flex-grow flex-col items-center justify-center gap-4">
			<h2 className="title">Leave Us Feedback!</h2>
			<p className="max-w-lg">
				Are you using our service and not pleased with it? Tell us what we are
				doing wrong, and we{"'"}ll do our best to fix it. Report bugs, glitches,
				things that are abnormally slow, suggest new features and anything else
				you{"'"}d like us to know by emailing us at the button below.
			</p>
			<a
				href={`mailto:feedback@coursify.studio`}
				rel="noopener norefferer"
				target="_blank"
				className="brightness-hover group flex cursor-pointer rounded-lg bg-backdrop-200 py-2.5 px-4 w-32 justify-between"
			>
				Email us!
				<EnvelopeIcon className="relative bottom h-5 w-5 group-hover:hidden" />
				<EnvelopeOpenIcon className="relative bottom hidden h-5 w-5 group-hover:block" />
			</a>
			<p>feedback@coursify.studio</p>
		</div>
	);
};

export default Feedback;

Feedback.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

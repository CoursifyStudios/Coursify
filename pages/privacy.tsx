import { ReactElement } from "react";
import { NextPageWithLayout } from "./_app";
import Layout from "@/components/layout/layout";

// THIS PAGE DESIGNED WITH MINIMAL CSS BECAUSE IT DOESN'T NEED ANY
// ALSO FASTER LOAD TIMES

const PrivacyPolicy: NextPageWithLayout = () => {
	return (
		<div className="mx-auto mt-8 grid gap-3 px-16">
			<h2 className="text-4xl font-bold">
				How your data is handled by Coursify
			</h2>
			<h2 className="title">What data we collect</h2>
			<p>
				To provide you with this service, we collect your:
				<br></br>
				<br></br>
				<ul>
					<li>Name</li>
					<li>Email</li>
					<li>Google account profile picture</li>
					<li>Graduation year</li>
					<li>Student id</li>
				</ul>
				<br></br>
				Additionally, you may choose to provide us with certain data, including
				your:<br></br>
				<br></br>
				<ul>
					<li>Preferred name</li>
					<li>Bio</li>
					<li>Phone Number</li>
				</ul>
				<br></br>
			</p>
			<h2 className="title-sm">Who your data is shared with</h2>
			<p>
				At Coursify, we are commited to student privacy. That is why we will
				never sell your personal data to anyone. In using our site, however,
				your data is shared with the following third parties for the basic
				functionality of the service:
				<br></br>
				<br></br>
				Our database provider, Supabase
				<br></br>
				<br></br>
				In certain testing phases (SHC school year 2023-2024), the Coursify team
				will have access to your data to troubleshoot any issues that might
				arise.
				<br></br>
				<br></br>
			</p>
			<h2 className="title">Changes to this policy</h2>
			<p>
				Because being a consumer in 2023 kind of sucks, this policy may be
				changed at any time. When such an event occurs, we will let you know by
				email at least 30 days in advance.
				<br></br>
				<br></br>
				If we are ever acquired or management changes, all of this could go
				right out the window.
				<br></br>
				<br></br>
				If you want to request all of your data, and/or have it deleted, send an
				email to privacy@coursify.studio.
				<br></br>
				<br></br>
			</p>
			<h2 className="title">Questions?</h2>
			<p>
				If you have a question about the privacy policy, or anything else about
				the service, please contact your Coursify rep
			</p>
			<h2 className="title">Legality</h2>
			<p>
				Coursify currently cannot afford a lawyer, and so we are nto sure if
				this is legally binding. Regardless, please do not sue us.
			</p>
			<p>
				Revision 1.0, last updated Monday, August 7, 2023 @ 9:30pm Pacific
				Standard Time
			</p>
		</div>
	);
};

export default PrivacyPolicy;

PrivacyPolicy.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

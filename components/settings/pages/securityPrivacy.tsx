import { NextPage } from "next";
import { useSettings } from "../../../lib/stores/settings";
import { Header } from "../components/header";
import { ToggleSection } from "../components/sections";

const Securityandprivacy: NextPage = () => {
	const { data, set } = useSettings();

	return (
		<>
			<Header name="security" page={4}>
				Security
			</Header>
			<Header name="privacy" page={4}>
				Privacy
			</Header>
			<ToggleSection
				name="Send anonymous data to teachers"
				beta={true}
				description="Allow teachers to account your workload when scheduling assignments and assessments using the Plates Tool."
				enabled={true}
				setEnabled={() =>
					set({
						//This is a placeholder cause it'll error if I don't have it
						compact: !data.compact,
					})
				}
			/>
			<Header name="data request" page={4}>
				Request My Data
			</Header>
			<p>
				If you would like to request a copy of your user data from Coursify,
				simply send an email to{" "}
				<a
					href="mailto:privacy@coursify.studio?subject=Coursify+Data+Request"
					className="font-semibold text-blue-500"
				>
					privacy@coursify.studio
				</a>{" "}
				and our team will get back to you within 30 days.
			</p>
		</>
	);
};

export default Securityandprivacy;

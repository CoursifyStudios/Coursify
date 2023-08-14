import { render } from "@react-email/render";
import { SES } from "@aws-sdk/client-ses";
import CoursifyInviteStudentEmail from "./onboardingStudent";

const ses = new SES({ region: process.env.AWS_SES_REGION });

const emailHtml = render(
	<CoursifyInviteStudentEmail
		name={"Lukas"}
		schoolName={"Coursify Dev School"}
		classCount={0}
	/>
);

const params = {
	Source: "onboarding@coursify.one",
	Destination: {
		ToAddresses: ["brandnlholl@gmail.com", "luseufert5@gmail.com"],
	},
	Message: {
		Body: {
			Html: {
				Charset: "UTF-8",
				Data: emailHtml,
			},
		},
		Subject: {
			Charset: "UTF-8",
			Data: "hello world",
		},
	},
};

ses.sendEmail(params);

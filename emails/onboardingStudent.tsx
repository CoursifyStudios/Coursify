import { LinkIcon } from "@heroicons/react/24/outline";

import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
import * as React from "react";

interface VercelInviteUserEmailProps {
	name: string;
	schoolName: string;
}

export const VercelInviteUserEmail = ({
	name = "Lukas",
	schoolName = "Sacred Heart Cathedral Preparatory",
}: VercelInviteUserEmailProps) => {
	const previewText = `Join ${schoolName} on Coursify`;

	return (
		<Html>
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body className="bg-white my-auto mx-auto mt-5 font-sans">
					<Container className="bg-gray-200 rounded-xl p-12">
						<Section className="mt-[32px]">
							<Img
								src="https://cdn.coursify.one/storage/v1/object/public/assets/emails/CoursifyLogo.png"
								alt="Coursify Logo"
								width={200}
								className="my-0 mx-auto"
							></Img>
						</Section>
						<Heading className="text-3xl font-normal text-center my-8">
							<strong>{schoolName}</strong> has invited you to join
							<strong className="text-pink-400"> Coursify</strong>
						</Heading>
						<Text className="text-black text-[14px] leading-[24px]">
							Hello {name},
						</Text>
						<Text className="text-black text-[14px] leading-[24px]">
							<strong>{schoolName}</strong> has invited you to{" "}
							<strong>5 classes</strong> on Coursify.
						</Text>

						<Section className="text-center mt-[32px] mb-[32px]">
							<Button
								pX={20}
								pY={12}
								className="bg-blue-500 rounded text-white text-[12px] font-semibold no-underline text-center"
								href="https://app.coursify.one/login"
							>
								Log into Coursify
							</Button>
						</Section>
						<Text className="text-black text-[14px] leading-[24px]">
							or copy and paste this URL into your browser:{" "}
							<Link
								href="https://app.coursify.one/login"
								className="text-blue-600 no-underline"
							>
								https://app.coursify.one/login
							</Link>
						</Text>
						<Hr className="border border-solid border-[#000000] my-[26px] mx-0 w-full" />
						<Text className="text-[#666666] text-[12px] leading-[24px]">
							This invitation was intended for{" "}
							<span className="text-black">{name} </span>. This invite was sent
							from <span className="text-black">1055, Ellis St. </span>
							in <span className="text-black">San Francisco, CA</span>. If you
							were not expecting this invitation, you can ignore this email.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default VercelInviteUserEmail;

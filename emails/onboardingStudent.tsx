import {
	Body,
	Button,
	Container,
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
	classCount: number;
}

export const VercelInviteUserEmail = ({
	name = "Lukas",
	schoolName = "Sacred Heart Cathedral Preparatory",
	classCount = 2,
}: VercelInviteUserEmailProps) => {
	const previewText = `Join ${schoolName} on Coursify`;
	const classesString = classCount === 1 ? "class" : "classes";
	return (
		<Html>
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body className="w-full bg-white my-auto mx-auto mt-5 font-sans">
					<Container className="w-full bg-gray-200 rounded-xl p-12">
						<Section className="w-full mt-[32px]">
							<Img
								src="https://cdn.coursify.one/storage/v1/object/public/assets/emails/CoursifyLogo.png"
								alt="Coursify Logo"
								width={200}
								className="w-full my-0 mx-auto"
							></Img>
						</Section>
						<Heading className="w-full text-3xl font-normal text-center my-8">
							<strong>{schoolName}</strong> has invited you to join
							<strong className="w-full text-pink-400"> Coursify</strong>
						</Heading>
						<Text className="w-full text-black text-[14px] leading-[24px]">
							Hello {name},
						</Text>
						<Text className="w-full text-black text-[14px] leading-[24px]">
							<strong>{schoolName}</strong> has invited you to{" "}
							<strong>
								{classCount} {classesString}
							</strong>{" "}
							on Coursify.
						</Text>

						<Section className="w-full text-center mt-[32px] mb-[32px]">
							<Button
								pX={20}
								pY={12}
								className="w-full bg-blue-500 rounded text-white text-[12px] font-semibold no-underline text-center"
								href="https://app.coursify.one/login"
							>
								Log into Coursify
							</Button>
						</Section>
						<Text className="w-full text-black text-[14px] leading-[24px]">
							or copy and paste this URL into your browser:{" "}
							<Link
								href="https://app.coursify.one/login"
								className="w-full text-blue-600 no-underline"
							>
								https://app.coursify.one/login
							</Link>
						</Text>
						<Hr className="w-full border border-solid border-[#000000] my-[26px] mx-0 w-full" />
						<Text className="w-full text-[#666666] text-[12px] leading-[24px]">
							This invitation was intended for{" "}
							<span className="w-full text-black">{name} </span>. This invite
							was sent from{" "}
							<span className="w-full text-black">1055, Ellis St. </span>
							in <span className="w-full text-black">San Francisco, CA</span>.
							If you were not expecting this invitation, you can ignore this
							email.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default VercelInviteUserEmail;

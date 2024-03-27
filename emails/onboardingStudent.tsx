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

interface CoursifyInviteStudentEmailProps {
	name: string;
	schoolName: string;
	classCount: number;
}

const CoursifyInviteStudentEmail = ({
	name = "Lukas",
	schoolName = "Sacred Heart Cathedral Preparatory",
}: CoursifyInviteStudentEmailProps) => {
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
							<strong>{schoolName}</strong> has invited you to your classes on
							Coursify.
						</Text>

						<Section className="text-center mt-[32px] mb-[32px]">
							<Button
								//@ts-ignore
								pX={20} //TODO: idk what the deal is with this erroring.
								pY={12}
								className="bg-blue-500 rounded-lg text-white text-[16px] font-semibold no-underline text-center"
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
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default CoursifyInviteStudentEmail;

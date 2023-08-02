import { LinkIcon } from "@heroicons/react/24/outline";

import {
	Body,
	Button,
	Container,
	Column,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Row,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
import * as React from "react";

interface VercelInviteUserEmailProps {
	name?: string;
	userImage?: string;
	invitedByUsername?: string;
	invitedByEmail?: string;
	schoolName?: string;
	teamImage?: string;
	inviteLink?: string;
}

export const VercelInviteUserEmail = ({
	name = "Lukas",
	userImage = ``,
	invitedByUsername = "Brandon",
	invitedByEmail = "25bholland@shcp.edu",
	schoolName = "Sacred Heart Cathedral Preparatory",
	teamImage = `https://cdn.coursify.one/static/vercel-team.png`,
}: VercelInviteUserEmailProps) => {
	const previewText = `Join ${schoolName} on Coursify`;

	return (
		<Html>
			<Head></Head>

			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body className="bg-white my-auto mx-auto mt-5 font-sans">
					<Container className="bg-gray-200 rounded-xl p-12">
						<Section className="mt-[32px] flex justify-center ">
							<svg
								width="128"
								height="128"
								viewBox="0 0 988 491"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M982 491C802.5 491 762.172 491 491 491C219.828 491 221 491 0 491C0 219.828 219.828 0 491 0C762.172 0 982 219.828 982 491Z"
									fill="url(#paint0_linear_1685_137)"
								/>
								<g filter="url(#filter0_bd_1685_137)">
									<rect
										x="606"
										y="103"
										width="370"
										height="99"
										rx="49.5"
										fill="white"
										fill-opacity="0.75"
										shape-rendering="crispEdges"
									/>
								</g>
								<g filter="url(#filter1_bd_1685_137)">
									<rect
										x="408"
										y="103"
										width="167"
										height="99"
										rx="49.5"
										fill="white"
										fill-opacity="0.75"
										shape-rendering="crispEdges"
									/>
								</g>
								<defs>
									<filter
										id="filter0_bd_1685_137"
										x="588"
										y="85"
										width="406"
										height="135"
										filterUnits="userSpaceOnUse"
										color-interpolation-filters="sRGB"
									>
										<feFlood flood-opacity="0" result="BackgroundImageFix" />
										<feGaussianBlur in="BackgroundImageFix" stdDeviation="9" />
										<feComposite
											in2="SourceAlpha"
											operator="in"
											result="effect1_backgroundBlur_1685_137"
										/>
										<feColorMatrix
											in="SourceAlpha"
											type="matrix"
											values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
											result="hardAlpha"
										/>
										<feOffset dx="2" dy="4" />
										<feGaussianBlur stdDeviation="5" />
										<feComposite in2="hardAlpha" operator="out" />
										<feColorMatrix
											type="matrix"
											values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"
										/>
										<feBlend
											mode="normal"
											in2="effect1_backgroundBlur_1685_137"
											result="effect2_dropShadow_1685_137"
										/>
										<feBlend
											mode="normal"
											in="SourceGraphic"
											in2="effect2_dropShadow_1685_137"
											result="shape"
										/>
									</filter>
									<filter
										id="filter1_bd_1685_137"
										x="390"
										y="85"
										width="203"
										height="135"
										filterUnits="userSpaceOnUse"
										color-interpolation-filters="sRGB"
									>
										<feFlood flood-opacity="0" result="BackgroundImageFix" />
										<feGaussianBlur in="BackgroundImageFix" stdDeviation="9" />
										<feComposite
											in2="SourceAlpha"
											operator="in"
											result="effect1_backgroundBlur_1685_137"
										/>
										<feColorMatrix
											in="SourceAlpha"
											type="matrix"
											values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
											result="hardAlpha"
										/>
										<feOffset dx="2" dy="4" />
										<feGaussianBlur stdDeviation="5" />
										<feComposite in2="hardAlpha" operator="out" />
										<feColorMatrix
											type="matrix"
											values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"
										/>
										<feBlend
											mode="normal"
											in2="effect1_backgroundBlur_1685_137"
											result="effect2_dropShadow_1685_137"
										/>
										<feBlend
											mode="normal"
											in="SourceGraphic"
											in2="effect2_dropShadow_1685_137"
											result="shape"
										/>
									</filter>
									<linearGradient
										id="paint0_linear_1685_137"
										x1="611.5"
										y1="-9.26072e-06"
										x2="580.987"
										y2="500.779"
										gradientUnits="userSpaceOnUse"
									>
										<stop stop-color="#F6BA7D" />
										<stop offset="1" stop-color="#ED89AF" />
									</linearGradient>
								</defs>
							</svg>
						</Section>
						<Heading className="text-3xl font-normal text-center my-8">
							<strong>{schoolName}</strong> has invited you to join
							<strong
								className=""
								style={{
									backgroundColor: "#f9a8d4",
									backgroundImage: "linear-gradient(45deg, #ED58AC, #FC8B55)",
									backgroundSize: "100%",
									backgroundRepeat: "repeat",
									WebkitBackgroundClip: "text",
									WebkitTextFillColor: "transparent",
									MozBackgroundClip: "text",
								}}
							>
								{" "}
								Coursify
							</strong>
						</Heading>
						<Text className="text-black text-[14px] leading-[24px]">
							Hello {name},
						</Text>
						<Text className="text-black text-[14px] leading-[24px]">
							<strong>{schoolName}</strong> has invited you to{" "}
							<strong>5 classes</strong> on Coursify LMS .
						</Text>
						<Section>
							<Row>
								<Column align="right">
									<Img
										className="rounded-full"
										src={userImage}
										width="64"
										height="64"
									/>
								</Column>
								<Column align="center">
									<LinkIcon className="h-4 w-4" />
								</Column>
								<Column align="left">
									<Img
										className="rounded-full"
										src={teamImage}
										width="64"
										height="64"
									/>
								</Column>
							</Row>
						</Section>
						<Section className="text-center mt-[32px] mb-[32px]">
							<Button
								pX={20}
								pY={12}
								className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center"
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
							located in <span className="text-black">San Francisco, CA</span>.
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

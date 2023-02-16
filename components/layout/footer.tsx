import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import karasuLogo from "../../public/brand-logos/karasu.png";
import { ColoredPill } from "../misc/pill";

export default function Footer() {
	//const [path, setPath] = useState("")
	const router = useRouter();
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => setHydrated(true), []);

	if (router.isReady && hydrated && router.asPath.startsWith("/login")) {
		return null;
	}

	return (
		<footer className="mt-10 flex justify-center">
			<div className="my-2 flex w-full max-w-screen-xl flex-col items-center justify-between px-4 text-sm font-medium md:flex-row md:px-8 xl:px-0">
				<div className="flex flex-col ">
					<Image
						src={karasuLogo}
						alt="Karasu logo"
						className="mx-auto mb-2 md:mx-0"
						width={70}
					/>
					{/* A next-generation LMS */}
				</div>
				<div className="mt-4 space-x-4 md:mt-0">
					<Link href="/privacy">
						<ColoredPill color="gray" hoverState>
							Privacy Policy
						</ColoredPill>
					</Link>
					<Link href="/schedule-editor">
						<ColoredPill color="gray" hoverState>
							Schedule Editor
						</ColoredPill>
					</Link>
				</div>
			</div>
		</footer>
	);
}

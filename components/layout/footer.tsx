import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ColoredPill } from "../misc/pill";
import { useTabs } from "@/lib/tabs/handleTabs";

export default function Footer() {
	//const [path, setPath] = useState("")
	const router = useRouter();
	const [hydrated, setHydrated] = useState(false);
	const isAdminPage = router.asPath.startsWith("/admin");
	const { newTab } = useTabs();

	useEffect(() => setHydrated(true), []);

	if (router.isReady && hydrated && router.asPath.startsWith("/login")) {
		return null;
	}

	return (
		<footer className="mt-10 flex justify-center bg-gray-200">
			<div className="my-4 flex  w-full max-w-screen-xl flex-col items-center justify-between px-4 text-sm font-medium compact:my-1 md:flex-row md:px-8 xl:px-0">
				<div className="flex flex-col">
					<h3 className="mx-auto bg-clip-text text-xl font-extrabold text-transparent md:ml-0 bg-gradient-to-r from-pink-400 to-orange-300">
						Coursify
						{isAdminPage ? " Admin" : ""}
					</h3>
					<p className="mt-4 flex flex-col items-center compact:mt-0 compact:text-xs md:mt-1 md:flex-row">
						<span>© 2023 Coursify Studios.&nbsp;</span>
						<span>Made with ❤️ in the United States</span>
					</p>
				</div>
				<div className="mt-4 space-x-4 md:mt-0">
					<Link
						href="/admin"
						onClick={() => newTab("/admin", "Admin Dashboard")}
					>
						<ColoredPill color="gray" hoverState>
							Admin Dashboard
						</ColoredPill>
					</Link>
					<Link href="/privacy">
						<ColoredPill color="gray" hoverState>
							Privacy Policy
						</ColoredPill>
					</Link>
				</div>
			</div>
		</footer>
	);
}

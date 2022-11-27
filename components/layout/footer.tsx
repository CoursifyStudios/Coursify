import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Footer() {
	//const [path, setPath] = useState("")
	const router = useRouter();
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => setHydrated(true), []);

	if (router.isReady && hydrated && router.asPath.startsWith("/login")) {
		return null;
	}

	return (
		<footer className="">
			This is not centered and it is pissing me off and I cannot figure out how
			to center it
		</footer>
	);
}

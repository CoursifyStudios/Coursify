import { useRouter } from "next/router";

export default function Footer() {
	const router = useRouter();
	if (router.isReady && router.asPath.startsWith("/login")) {
		return null;
	}
	return (
		<footer className="">
			This is not centered and it is pissing me off and I cannot figure out how
			to center it
		</footer>
	);
}

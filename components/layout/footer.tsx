import { useRouter } from "next/router";

export default function Footer() {
	const router = useRouter();
	if (router.isReady && router.asPath.startsWith("/login")) {
		return null;
	}
	return <footer className="">Footer</footer>;
}

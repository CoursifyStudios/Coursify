import { ReactNode } from "react";
import { useSettings } from "../../lib/stores/settings";
import Footer from "./footer";
import Navbar from "./navbar";

export default function Layout(props: { children: ReactNode }) {
	const { data, set } = useSettings();

	return (
		<div
			className={`flex min-h-screen flex-col bg-backdrop text-gray-800 transition-all duration-300 ${
				data.theme == "dark" && "dark"
			} ${data.compact && "compact"}`}
		>
			<Navbar />
			<div className="flex flex-1 flex-col">{props.children}</div>
			<Footer />
		</div>
	);
}

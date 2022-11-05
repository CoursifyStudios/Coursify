import { ReactNode } from "react";
import Footer from "./footer";
import Navbar from "./navbar";

export default function Layout(props: { children: ReactNode }) {
	return (
		<div className="flex min-h-screen flex-col">
			<Navbar />
			<div className="flex flex-1 flex-col items-start">{props.children}</div>
			<Footer />
		</div>
	);
}

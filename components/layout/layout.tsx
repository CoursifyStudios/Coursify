import { ReactNode } from "react";
import Footer from "./footer";
import Navbar from "./navbar";

export default function Layout(props: { children: ReactNode }) {
	return (
		<div className="flex min-h-screen flex-col text-gray-900 ">
			<Navbar />
			<div className="flex flex-1 flex-col">{props.children}</div>
			<Footer />
		</div>
	);
}

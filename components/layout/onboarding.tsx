import Image from "next/image";
import { ReactNode } from "react";
import pinkEllipse from "@/public/svgs/pinkEllipse.svg";
import blueCircle from "@/public/svgs/blueCircle.svg";
import orangeCircle from "@/public/svgs/orangeCircle.svg";

export const OnboardingLayout = ({ children }: { children: ReactNode }) => {
	return (
		<div className="flex bg-gradient-to-br from-yellow-100 h-screen overflow-hidden to-pink-300 dark:from-transparent dark:to-transparent dark:bg-blue-950 justify-center relative">
			<div className="dark:visible invisible select-none absolute top-0 left-0">
				<Image
					src={pinkEllipse}
					alt="A Pink Ellipse"
					priority
					draggable="false"
				/>
			</div>
			<div className="dark:visible invisible select-none absolute top-0 right-0">
				<Image
					src={blueCircle}
					alt="A Blue Circle"
					priority
					draggable="false"
				/>
			</div>
			<div className="dark:visible select-none invisible absolute bottom-0 right-0">
				<Image
					src={orangeCircle}
					alt="A Orange Circle"
					priority
					draggable="false"
				/>
			</div>
			<div className="absolute inset-0 backdrop-blur-xl overflow-y-auto ">
				<div className="flex items-center flex-col py-10 z-50 min-h-screen ">
					{children}

					<h3 className="text-center z-50 bg-gradient-to-r pt-10 from-brand-pink to-brand-orange bg-clip-text text-3xl font-extrabold text-transparent md:ml-0 mt-auto">
						Coursify
					</h3>
				</div>
			</div>
		</div>
	);
};

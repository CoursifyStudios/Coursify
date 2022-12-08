import { Class } from "../../lib/db/classes";
import Image from "next/image";
import { ColoredPill } from "../misc/pill";
import Link from "next/link";
import { useTabs } from "../../lib/tabs/handleTabs";
import exampleImage from "../../public/example-img.jpg";

export function Class(props: {
	class?: Class;
	className?: string;
	linkTo?: string;
	isLoading?: boolean;
}) {
	const { newTab } = useTabs();

	if (props.isLoading == true || typeof props.class == "undefined") {
		return (
			<div className="flex h-48 w-[19rem] animate-pulse rounded-xl bg-gray-200"></div>
		);
	}

	if (props.linkTo)
		return (
			/*@ts-ignore-error line 7*/
			<Link
				href={props.linkTo}
				onClick={() => newTab(props.linkTo, props.class.data.name)}
			>
				{/*@ts-ignore-error line 7*/}
				<Component />
			</Link>
		);

	return (
		//@ts-ignore-error line 7
		<Component />
	);

	function Component() {
		if (!(typeof props.class == "undefined"))
			return (
				<div
					className={
						"brightness-hover group flex w-[19rem] cursor-pointer flex-col rounded-xl bg-gray-200 " +
						props.className
					}
				>
					<div className="relative h-32 ">
						<Image
							src={exampleImage}
							alt="Example Image"
							className="rounded-t-xl object-cover object-center"
							placeholder="blur"
							fill
						/>
					</div>
					<div className="flex flex-grow flex-col  p-4">
						<div className="flex items-start justify-between">
							<h3 className="break-words text-xl font-semibold line-clamp-2">
								{props.class.data.name}
							</h3>
							<ColoredPill color={props.class.data.color}>
								11:30 - 12:15
							</ColoredPill>
						</div>
						<p>Teacher name</p>
					</div>
				</div>
			);
	}
}

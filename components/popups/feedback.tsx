import { Dispatch, SetStateAction, useState } from "react";
import { Popup } from "../misc/popup";
import { Button } from "../misc/button";

const topics = [
	"General Bug Report",
	"Feature Request",
	"Performance Feedback",
	"Security Concerns",
	"Keyboard Navigation/Screenreader Issues",
];
const pages = [
	"Homepage Classes/Assignments",
	"Homepage Schedule",
	"Assignments Dashboard",
	"Class Homepage",
	"Profile Page",
	"Settings",
	"Login Page",
	"Admin Dashboard",
	"Other",
];

const FeedbackPopup = ({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
	const defaultContent = {
		topic: -1,
		page: -1,
		title: "",
		content: "",
	};
	const [content, setContent] = useState(defaultContent);
	const [page, setPage] = useState(0);
	const [accepted, setAccecpted] = useState(false);

	const Selector = ({
		content,
		selected,
	}: {
		content: string;
		selected: number;
	}) => (
		<div
			onClick={() => {
				setContent((content) => {
					return { ...content, [page == 0 ? "topic" : "page"]: selected };
				});
				setPage((page) => page + 1);
			}}
			className="p-4 bg-gray-200 brightness-hover rounded-xl cursor-pointer font-medium"
		>
			{content}
		</div>
	);

	return (
		<Popup
			open={open}
			closeMenu={() => {
				setOpen(false);
				setContent(defaultContent);
				setPage(0);
			}}
			size="xs"
		>
			<h2 className="title-sm">Coursify feedback</h2>
			<div className="gap-4 flex flex-col mt-4 [&>label]:flex [&>label]:flex-col">
				{page == 0 &&
					topics.map((topic, i) => (
						<Selector content={topic} key={i} selected={i} />
					))}
				{page == 1 &&
					pages.map((page, i) => (
						<Selector content={page} key={i} selected={i} />
					))}
				{page == 2 && (
					<>
						<label>
							<span className="label-text label-required">
								Descriptive Title
							</span>
							<input
								type="text"
								name="title"
								onChange={(v) =>
									setContent((content) => ({
										...content,
										title: v.target.value,
									}))
								}
							/>
						</label>
						<label>
							<span className="label-text label-required">
								Clear and Concise Description of the Issue Encountered
							</span>
							<textarea
								name="title"
								onChange={(v) =>
									setContent((content) => ({
										...content,
										content: v.target.value,
									}))
								}
							/>
						</label>
						<label className="cursor-pointer !flex-row text-xs items-center">
							<input
								type="checkbox"
								onChange={(v) => setAccecpted(v.target.checked)}
							/>
							<span className="ml-4 label-required">
								This suggestion is not spam, harmful or potentiually unwanted
								content. If you{"'"}re unsure, do not submit it. Doing so may
								led to a suspension from the feedback system, among other
								account restrictions.{" "}
							</span>
						</label>
					</>
				)}
			</div>
			<div className="mt-4 flex ml-auto gap-4">
				{page != 0 && (
					<Button onClick={() => setPage((page) => page - 1)}>Back</Button>
				)}
				{page == 2 && (
					<Button
						color="bg-blue-500"
						className="text-white"
						disabled={
							!accepted ||
							content.title.length == 0 ||
							content.content.length == 0
						}
					>
						Submit
					</Button>
				)}
			</div>
		</Popup>
	);
};
export default FeedbackPopup;

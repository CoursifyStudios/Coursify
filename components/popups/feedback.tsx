import { Dispatch, SetStateAction, useState } from "react";
import { Popup } from "../misc/popup";
import { Button } from "../misc/button";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Database } from "@/lib/db/database.types";
import { newFeedback } from "@/lib/db/feedback";
import { LoadingSmall } from "../misc/loading";
import { useRouter } from "next/router";
import confetti from "canvas-confetti";

export const topics = [
	"General Bug Report",
	"Feature Request",
	"Performance Feedback",
	"Security Concerns",
	"Keyboard Navigation/Screenreader Issues",
];
export const pages = [
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
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const supabase = useSupabaseClient<Database>();
	const user = useUser();
	const router = useRouter();

	const submitFeedback = async () => {
		if (!user) {
			setError("No user found");
			return;
		}
		setLoading(true);
		const { error } = await newFeedback(
			supabase,
			{
				...content,
				route: router.asPath,
			},
			user.id
		);
		if (error) {
			setError(error.message);
			return;
		}
		setPage(3);
		setLoading(false);
		confetti({
			particleCount: 200,
			disableForReducedMotion: true,
			spread: 80,
			angle: 80,
			origin: {
				y: 0.7,
				x: 0.55,
			},
		});
		confetti({
			particleCount: 200,
			disableForReducedMotion: true,
			spread: 80,
			angle: 110,
			origin: {
				y: 0.6,
				x: 0.45,
			},
		});
		confetti({
			particleCount: 100,
			disableForReducedMotion: true,
			spread: 80,
			startVelocity: 55,
			origin: {
				y: 0.6,
				x: 0.5,
			},
		});
		confetti({
			particleCount: 100,
			disableForReducedMotion: true,
			spread: 80,
			angle: 100,
			origin: {
				y: 0.65,
				x: 0.47,
			},
		});
	};

	const closeMenu = () => {
		setOpen(false);
		setContent(defaultContent);
		setPage(0);
	};

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
		<Popup open={open} closeMenu={closeMenu} size="xs">
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
								This submission is relevant and provides value to the Coursify
								Team.
							</span>
						</label>
					</>
				)}
				{page == 3 && (
					<>
						<h2 className="text-xl font-medium text-center">Thanks!</h2>
						<p className="text-center text-sm">
							Your feedback is truly invaluable. We appreciate hearing from
							users like you as it helps us enhance Coursify and create a better
							learning experience for everyone. Please note, in some cases, we
							may email you to follow up on specific issues or feature requests.
						</p>
					</>
				)}
			</div>
			<div className="mt-4 flex ml-auto gap-4">
				{page != 0 && page != 3 && (
					<Button onClick={() => setPage((page) => page - 1)}>Back</Button>
				)}
				{page == 2 && (
					<Button
						color="bg-blue-500"
						className="text-white"
						onClick={submitFeedback}
						disabled={
							!accepted ||
							content.title.length == 0 ||
							content.content.length == 0
						}
					>
						Submit {loading && <LoadingSmall className="ml-2" />}
					</Button>
				)}
			</div>
			{page == 3 && (
				<Button
					onClick={closeMenu}
					color="bg-blue-500"
					className="text-white mx-auto"
				>
					Close
				</Button>
			)}
			<span className="text-red-700">{error && `Error: ${error}`}</span>
		</Popup>
	);
};
export default FeedbackPopup;
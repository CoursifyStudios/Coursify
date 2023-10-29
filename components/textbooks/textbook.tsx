import { useTabs } from "@/lib/tabs/handleTabs";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export const Textbook = ({
	book,
}: {
	book: {
		id: string;
		subject: string;
		course: string;
		isbn: string;
		title: string;
		author: string | null;
		edition: string | null;
		publisher: string | null;
		adoption_level: string | null;
		new_only: string | null;
	};
}) => {
	const { newTab } = useTabs();
	return (
		<div className="p-4 bg-gray-200 rounded-md grid">
			<p>{book.title}</p>
			<p>
				{book.adoption_level} - {book.course}
			</p>
			<Link
				className="ml-auto bg-blue-300 flex py-1.5 px-2 rounded-lg mt-auto"
				href={"/textbooks/" + book.id}
				onClick={() => newTab("/textbooks/" + book.id, book.title)}
			>
				View Listings
				<ArrowTopRightOnSquareIcon className="h-6 w-6 ml-2" />
			</Link>
		</div>
	);
};

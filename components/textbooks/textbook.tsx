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
		<div className="p-3 bg-gray-200 rounded-md grid">
			<p>{book.title}</p>
			<p>
				{book.adoption_level} - {book.course}
			</p>
			<Link
				className="bg-blue-500 flex py-1.5 px-2 rounded-lg ml-auto mt-auto"
				href={"/textbooks/books/" + book.title + "/" + book.id}
				onClick={() =>
					newTab("/textbooks/books/" + book.title + "/" + book.id, book.title)
				}
			>
				View Listings
				<ArrowTopRightOnSquareIcon className="h-6 w-6 ml-2" />
			</Link>
		</div>
	);
};

import Link from "next/link";

export const TextbookNavbar = ({ title }: { title?: string }) => {
	return (
		<div className="flex ml-7 font-bold">
			<>
				<Link
					className="m-3 px-4 py-2 bg-gray-200 rounded-lg"
					href="/textbooks"
				>
					All Offers
				</Link>
				<Link
					className="m-3 px-4 py-2 bg-gray-200 rounded-lg"
					href="/textbooks/booklist"
				>
					Books
				</Link>
			</>
			<p className="m-auto text-2xl">{title}</p>
		</div>
	);
};

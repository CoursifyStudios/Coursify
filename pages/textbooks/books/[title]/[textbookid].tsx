import { useRouter } from "next/router";
import { NextPageWithLayout } from "../../../_app";
import { ReactElement, useEffect, useState } from "react";
import Layout from "@/components/layout/layout";
import { CoursifyFile } from "@/components/files/genericFileUpload";
import { getListingsForBook, handleConditions } from "@/lib/db/textbooks";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { TextbookNavbar } from "@/components/textbooks/navbar";
import { Listing } from "@/components/textbooks/listing";
import { Button } from "@/components/misc/button";
import { CreateListing } from "@/components/textbooks/createListing";
import { getDataOutArray } from "@/lib/misc/dataOutArray";

const Textbook: NextPageWithLayout = () => {
	const router = useRouter();
	const { textbookid, title } = router.query;
	const supabase = useSupabaseClient();
	const user = useUser();
	const [conditionFilter, setConditionFilter] = useState<number[]>([]);
	const [flexiblePricing, setFlexiblePricing] = useState<boolean>(false);
	const [minPrice, setMinPrice] = useState<number>(0);
	const [maxPrice, setMaxPrice] = useState<number>();
	const [search, setSearch] = useState("");
	const [showPosting, setShowPosting] = useState(false);
	const [listings, setListings] = useState<
		{
			id: string;
			textbooks: {
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
			} | null; //why ts why
			users: {
				id: string;
				full_name: string;
				avatar_url: string;
				email: string;
			} | null; //why
			pictures: CoursifyFile[];
			condition: number;
			info: string;
			price: number;
			pricing_flexible: boolean;
		}[]
	>([]);

	useEffect(() => {
		if (typeof textbookid == "string") {
			(async () => {
				const data = await getListingsForBook(supabase, textbookid);
				if (data.data) {
					setListings(
						data.data.map((listing) => {
							return {
								...listing,
								condition: listing.condition ?? 0,
								info: listing.info ?? "None given",
								pictures: listing.pictures
									? (listing.pictures as unknown as CoursifyFile[])
									: [],
								price: listing.price ?? 0,
								pricing_flexible: listing.pricing_flexible ?? false,
							};
						})
					);

					setMaxPrice(Math.max(...data.data.map((listing) => listing.price!)));
				}
			})();
		}
	}, [supabase, textbookid]);
	return (
		<>
			{typeof textbookid == "string" && showPosting && (
				<CreateListing
					open={showPosting}
					setOpen={setShowPosting}
					supabase={supabase}
					book={{
						id: textbookid,
						title: getDataOutArray(title) ?? listings[0].textbooks?.title!,
					}}
					addListing={(listing) =>
						setListings(
							listings.concat({
								...listing,
								textbooks: listings[0].textbooks,
								users: {
									id: user?.id!,
									email: user?.email!,
									avatar_url: user?.user_metadata.avatar_url!,
									full_name: user?.user_metadata.full_name,
								},
							})
						)
					}
				/>
			)}
			<TextbookNavbar title={listings[0]?.textbooks?.title} />
			<div className="flex">
				<section className="bg-gray-200 w-80 p-4 rounded-r-3xl">
					<p>Quality</p>
					{Array.from(
						new Set(listings.map((listing) => listing.condition))
					).map((actualAttribute, i) => (
						<div key={i} className="w-full p-1 flex gap-2">
							<input
								value={actualAttribute}
								type="checkbox"
								checked={conditionFilter.includes(
									actualAttribute ?? "Not Specified"
								)}
								onChange={(e) => {
									if (e.target.checked) {
										setConditionFilter(
											conditionFilter.concat(actualAttribute ?? "Not Specified")
										);
									} else {
										const tempArr = [...conditionFilter];
										tempArr.splice(
											conditionFilter.indexOf(parseInt(e.target.value)),
											1
										);
										setConditionFilter(tempArr);
									}
								}}
							/>
							<p>
								{!actualAttribute || actualAttribute == 0
									? "Not Specified"
									: handleConditions(actualAttribute)}
							</p>
						</div>
					))}
					Pricing
					<div className="w-full p-1 flex gap-2">
						<input
							value={"flexible_pricing"}
							type="checkbox"
							checked={flexiblePricing}
							onChange={(e) => {
								setFlexiblePricing(!flexiblePricing);
							}}
						/>
						<p>Flexible Pricing</p>
					</div>
					<div className="flex gap-2">
						<input
							value={minPrice}
							type="range"
							min="0"
							max={Math.max(...listings.map((listing) => listing.price))}
							onChange={(e) => {
								setMinPrice(parseFloat(e.target.value));
							}}
						/>
						<p>Min. Price ${minPrice}</p>
					</div>
					<div className="flex gap-2">
						<input
							value={maxPrice}
							type="range"
							min="0"
							max={Math.max(...listings.map((listing) => listing.price))}
							onChange={(e) => {
								setMaxPrice(parseFloat(e.target.value));
							}}
						/>

						<p>Max. Price ${maxPrice}</p>
					</div>
				</section>
				<section className="mx-10 w-full">
					<div className="flex gap-4 mb-4">
						<Button onClick={() => setShowPosting(true)}>Sell This Book</Button>
						<div className={"relative flex grow items-center transition-all"}>
							<MagnifyingGlassIcon className="absolute left-3 h-4 w-4" />
							<input
								type="text"
								className="grow !rounded-xl py-0.5 placeholder:dark:text-gray-400 pl-8"
								placeholder="Search for words in descriptions"
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>
					</div>
					{listings.length > 0 ? (
						<div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 grow gap-3">
							{listings
								.filter(
									(listing) =>
										(conditionFilter.includes(listing.condition) ||
											conditionFilter.length == 0) &&
										(search.length == 0 ||
											listing.info.toLowerCase().includes(search.toLowerCase()))
								)
								.map((listing) => (
									<Listing key={listing.id} listing={listing} />
								))}
						</div>
					) : (
						<p>Sorry, no listings for that book could be found.</p>
					)}
				</section>
			</div>
		</>
	);
};

export default Textbook;

Textbook.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

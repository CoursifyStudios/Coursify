import { getAllListings, handleConditions } from "@/lib/db/textbooks";
import { NextPageWithLayout } from "../_app";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Layout from "@/components/layout/layout";
import { Disclosure } from "@headlessui/react";
import {
	ChevronRightIcon,
	MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { TextbookNavbar } from "@/components/textbooks/navbar";
import { CoursifyFile } from "@/components/files/genericFileUpload";
import { SpecificCheckboxList } from "./booklist";
import { Listing } from "@/components/textbooks/listing";
import { ReactElement, useState } from "react";
import Dropdown from "@/components/misc/dropdown";

const Offers: NextPageWithLayout = () => {
	const supabase = useSupabaseClient();
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [minPrice, setMinPrice] = useState<number>(0);
	const [maxPrice, setMaxPrice] = useState<number>();

	const sortOptions = [
		{ name: "Price (Ascending)" },
		{ name: "Price (Descending)" },
		{ name: "Quality (Ascending)" },
		{ name: "Quality (Descending)" },
	];

	const [sort, setSort] = useState(sortOptions[0]);

	const [classFilters, setClassFilters] = useState<string[]>([]);
	const [adoptionFilter, setAdoptionFilter] = useState<string[]>([]);
	const [newOnlyFilter, setNewOnlyFilter] = useState<string[]>([]);
	const [conditionFilter, setConditionFilter] = useState<number[]>([]);
	const [flexiblePricing, setFlexiblePricing] = useState<boolean>(false);
	const [sellerFilter, setSellerFilter] = useState<string[]>([]);
	const [authorFilter, setAuthorFilter] = useState<string[]>([]);
	const [editionFilter, setEditionFilter] = useState<string[]>([]);
	const [publisherFilter, setPublisherFilter] = useState<string[]>([]);
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
			} | null;
			users: {
				id: string;
				full_name: string;
				avatar_url: string;
				email: string;
			} | null;
			pictures: CoursifyFile[];
			condition: number;
			info: string;
			price: number;
			pricing_flexible: boolean;
		}[]
	>([]);

	useState(() => {
		(async () => {
			const data = await getAllListings(supabase);
			if (data.data) {
				setListings(
					data.data.map((listing) => {
						return {
							...listing,
							condition: listing.condition ?? 0,
							info: listing.info ?? "",
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
	});

	return (
		<>
			<TextbookNavbar title="All offers for SHC books" />
			<div className="flex">
				<section className="bg-gray-200 w-80 sm:shrink-0 p-4 rounded-r-2xl">
					<p className="text-lg font-semibold">Filters:</p>
					<div className="grid">
						<p className="mt-1 font-semibold">Class</p>
						{Array.from(
							new Set(listings.map((listing) => listing.textbooks?.subject))
						).map((subject, i) => (
							<SpecificCheckboxList
								key={i}
								items={listings
									.filter((listing) => listing.textbooks?.subject == subject)
									.map((listing) => listing.textbooks?.course)}
								filter={classFilters}
								setFilter={setClassFilters}
								title={subject}
							/>
						))}
						<hr className="h-px bg-black border-0 m-2 mx-6" />
						<SpecificCheckboxList
							items={listings.map(
								(listing) => listing.textbooks?.adoption_level
							)}
							filter={adoptionFilter}
							setFilter={setAdoptionFilter}
							title="Adoption Level"
						/>
						<SpecificCheckboxList
							items={listings.map(
								(listing) => listing.textbooks?.adoption_level
							)}
							filter={newOnlyFilter}
							setFilter={setNewOnlyFilter}
							title="New Only"
						/>
						<p></p>
						<Disclosure>
							{({ open }) => (
								<>
									<Disclosure.Button className="flex justify-between">
										Pricing
										<ChevronRightIcon
											className={
												open ? "rotate-90 transform h-5 w-5" : "h-6 w-5"
											}
										/>
									</Disclosure.Button>
									<Disclosure.Panel>
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
												max={Math.max(
													...listings.map((listing) => listing.price)
												)}
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
												max={Math.max(
													...listings.map((listing) => listing.price)
												)}
												onChange={(e) => {
													setMaxPrice(parseFloat(e.target.value));
												}}
											/>

											<p>Max. Price ${maxPrice}</p>
										</div>
									</Disclosure.Panel>
								</>
							)}
						</Disclosure>
						<Disclosure>
							{({ open }) => (
								<>
									<Disclosure.Button className="flex justify-between">
										Quality
										<ChevronRightIcon
											className={
												open ? "rotate-90 transform h-5 w-5" : "h-6 w-5"
											}
										/>
									</Disclosure.Button>
									<Disclosure.Panel>
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
																conditionFilter.concat(
																	actualAttribute ?? "Not Specified"
																)
															);
														} else {
															const tempArr = [...conditionFilter];
															tempArr.splice(
																conditionFilter.indexOf(
																	parseInt(e.target.value)
																),
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
									</Disclosure.Panel>
								</>
							)}
						</Disclosure>
						<SpecificCheckboxList
							items={listings.map((listing) => listing.users?.full_name)}
							filter={sellerFilter}
							setFilter={setSellerFilter}
							title="Seller"
						/>
						<SpecificCheckboxList
							items={listings.map((listing) => listing.textbooks?.author)}
							filter={authorFilter}
							setFilter={setAuthorFilter}
							title="Author"
						/>
						<SpecificCheckboxList
							items={listings.map((listing) => listing.textbooks?.edition)}
							filter={editionFilter}
							setFilter={setEditionFilter}
							title="Edition"
						/>
						<SpecificCheckboxList
							items={listings.map((listing) => listing.textbooks?.publisher)}
							filter={publisherFilter}
							setFilter={setPublisherFilter}
							title="Publisher"
						/>
					</div>
				</section>
				<section className="w-full max-w-screen-2xl px-3">
					<div className="flex gap-4 mb-4">
						<div className={"relative flex grow items-center transition-all"}>
							<MagnifyingGlassIcon className="absolute left-3 h-4 w-4" />
							<input
								type="text"
								className="grow !rounded-xl py-0.5 placeholder:dark:text-gray-400 pl-8"
								placeholder="Search by Author, Title, ISBN or other attribute..."
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>
						<Dropdown
							onChange={setSort}
							selectedValue={sort}
							values={sortOptions}
						/>
					</div>
					<div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 grow gap-3">
						{sortListings(
							listings.filter(
								(listing) =>
									(classFilters.length == 0 ||
										classFilters.includes(listing.textbooks!.course)) &&
									(adoptionFilter.length == 0 ||
										adoptionFilter.includes(
											listing.textbooks!.adoption_level ?? "Not Specified"
										)) &&
									(newOnlyFilter.length == 0 ||
										newOnlyFilter.includes(
											listing.textbooks!.new_only ?? "Not Specified"
										)) &&
									(sellerFilter.length == 0 ||
										sellerFilter.includes(listing.users?.full_name!)) &&
									(authorFilter.length == 0 ||
										authorFilter.includes(listing.textbooks?.author!)) &&
									(editionFilter.length == 0 ||
										editionFilter.includes(listing.textbooks?.edition!)) &&
									(publisherFilter.length == 0 ||
										publisherFilter.includes(listing.textbooks?.publisher!)) &&
									(flexiblePricing ? listing.pricing_flexible : true) &&
									(conditionFilter.length == 0 ||
										conditionFilter.includes(listing.condition)) &&
									listing.price >= minPrice &&
									listing.price <= maxPrice! &&
									(search.length == 0 ||
										Array.from([
											listing.textbooks!.author
												? listing.textbooks!.author
												: "n/a",
											listing.textbooks!.course,
											listing.textbooks!.isbn,
											listing.textbooks!.subject,
											listing.textbooks!.title,
										]).some((someText) =>
											someText.toLowerCase().includes(search.toLowerCase())
										))
							)!
						)?.map((listing) => <Listing key={listing.id} listing={listing} />)}
					</div>
					{/* dont need this */}
					<div className="flex justify-center mt-2">
						{Array.from(
							{ length: Math.ceil(listings.length / 60.0) },
							(v, i) => i
						).map((aNumber) => (
							<button
								key={aNumber}
								className={
									"py-4 px-6 rounded-lg " +
									(page == aNumber + 1 && "bg-gray-200")
								}
							>
								{aNumber + 1}
							</button>
						))}
					</div>
				</section>
			</div>
		</>
	);

	function sortListings(
		items: {
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
			} | null;
			users: {
				id: string;
				full_name: string;
				avatar_url: string;
				email: string;
			} | null;
			pictures: CoursifyFile[];
			condition: number;
			info: string;
			price: number;
			pricing_flexible: boolean;
		}[]
	) {
		switch (sort.name) {
			case "Price (Ascending)":
				return items.sort((a, b) => {
					if (a.price > b.price) return 1;
					else return -1;
				});
			case "Price (Descending)":
				return items.sort((a, b) => {
					if (a.price < b.price) return 1;
					else return -1;
				});
			case "Quality (Ascending)":
				return items.sort((a, b) => {
					if (a.condition > b.condition) return 1;
					else return -1;
				});
			case "Quality (Descending)":
				return items.sort((a, b) => {
					if (a.condition < b.condition) return 1;
					else return -1;
				});
		}
	}
};

export default Offers;

Offers.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

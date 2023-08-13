import { Database } from "@/lib/db/database.types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { NextPage } from "next";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const ImagePicker: NextPage<{
	setPicked: (v: string) => void;
}> = ({ setPicked }) => {
	const [selected, setSelected] = useState("");
	const [images, setImages] = useState<string[]>([]);
	const [error, setError] = useState<string>();
	const [loading, setLoading] = useState<boolean>();
	const supabase = useSupabaseClient<Database>();

	useEffect(() => {
		(async () => {
			if (images.length || !supabase) return;

			setError(undefined);
			setLoading(true);
			const { data, error } = await supabase.storage
				.from("cdn")
				.list("assets/groupImages");

			if (error) {
				setError(error.message);
			} else if (data) {
				setImages(
					data.map(
						(img) =>
							`https://cdn.coursify.one/storage/v1/object/public/cdn/assets/groupImages/${img.name}`
					)
				);
			}
			setLoading(false);
		})();
	}, [images, supabase]);

	return (
		<>
			<div className="w-full grid grid-cols-3 gap-4 h-[30vh] overflow-y-auto scrollbar-fancy">
				{images?.map((img) => (
					<Image
						className={`h-32 w-full object-cover rounded-2xl brightness-hover cursor-pointer ${
							selected == img ? "brightness-focus" : "brightness-50"
						}  `}
						src={img}
						key={img}
						width={300}
						height={150}
						alt=""
						onClick={() => {
							setSelected(img);
							setPicked(img);
						}}
						loading="lazy"
					/>
				))}
			</div>
		</>
	);
};
export default ImagePicker;

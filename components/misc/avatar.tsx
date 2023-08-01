import Image from "next/image";

type AvatarProps = {
	full_name: string;
	avatar_url: string;
	width: string;
	height: string;
	text_size?: string;
};

function getInitials(fullName: string): string {
	const words = fullName.trim().split(/\s+/);
	return words.map((word) => word.charAt(0).toUpperCase()).join("");
}

function Avatar({
	full_name,
	avatar_url,
	width,
	height,
	text_size = "sm",
}: AvatarProps) {
	const initials = getInitials(full_name);

	return (
		<div className="flex items-center">
			{avatar_url ? (
				<Image
					src={avatar_url}
					width={350}
					height={350}
					alt={`${full_name}'s profile picture`}
					className={`rounded-full mr-4 h-${height} w-${width}`}
				/>
			) : (
				<div
					className={`bg-gradient-to-br from-pink-400 to-orange-300 w-${width} h-${height} relative shrink-0 rounded-full `}
				>
					<div
						className={`flex h-${height} w-${width} items-center text-white justify-center text-${text_size} rounded-full`}
					>
						{initials}
					</div>
				</div>
			)}
		</div>
	);
}

export default Avatar;

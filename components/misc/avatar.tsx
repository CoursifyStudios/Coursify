import Image from "next/image";

type AvatarProps = {
	full_name: string;
	avatar_url: string;
	size: string;
	text_size?: string;
	className?: string;
};

function getInitials(fullName: string): string {
	const words = fullName.trim().split(/\s+/);
	return words.map((word) => word.charAt(0).toUpperCase()).join("");
}

function Avatar({
	full_name,
	avatar_url,
	size,
	text_size = "sm",
	className,
}: AvatarProps) {
	const initials = getInitials(full_name);

	return (
		<div className={`flex items-center ${className}`}>
			{avatar_url ? (
				<Image
					src={avatar_url}
					width={350}
					height={350}
					alt={`${full_name}'s profile picture`}
					className={`rounded-full h-${size} w-${size}`}
				/>
			) : (
				<div
					className={`bg-gradient-to-br from-pink-400 to-orange-300 w-${size} h-${size} relative shrink-0 rounded-full `}
				>
					<div
						className={`flex h-${size} w-${size} items-center text-white justify-center text-${text_size} rounded-full`}
					>
						{initials}
					</div>
				</div>
			)}
		</div>
	);
}

export default Avatar;

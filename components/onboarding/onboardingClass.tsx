export default function OnboardClasses({
	class_name,
	blockNum,
	teacherName,
	color,
}: {
	class_name: string;
	blockNum: number;
	teacherName: string;
	color: string;
}) {
	return (
		<div className="w-full flex justify-between items-center  bg-white/50 dark:bg-transparent border dark:border-white/10 rounded-xl h-20 px-6">
			<div>
				<h1 className="w-full text-xl font-semibold">{class_name}</h1>
				<p className="w-full text-sm">{teacherName}</p>
			</div>
			<h2
				className={`text-2xl font-bold px-3 py-1 bg-backdrop-200/20  rounded-lg text-${color}-300 saturate-200 dark:saturate-100 border border-gray-300 dark:border-gray-800/10 backdrop-blur-xl`}
			>
				{blockNum}
			</h2>
		</div>
	);
}

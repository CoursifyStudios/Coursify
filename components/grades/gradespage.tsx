import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import { ColoredPill } from "../misc/pill";

interface GPAProps {
	gpatype: string;
	gpa: string;
}

interface GradeSummaryProps {
	ClassName: string;
	LetterGrade: string;
	Percentage: string;
}

interface RecentlyGradedProps {
	AssignmentName: string;
	ClassName: string;
	Points: string;
	ClassColor: string;
}

const GPA: React.FC<GPAProps> = ({ gpatype, gpa }) => {
	return (
		<div className="m-2 flex flex-col items-center justify-center space-x-2 p-4">
			<h1 className="text-6xl font-bold">{gpa}</h1>
			<p className="">{gpatype}</p>
		</div>
	);
};

export default GPA;

const GradeSummaryComponent: React.FC<GradeSummaryProps> = ({
	ClassName,
	LetterGrade,
	Percentage,
}) => {
	return (
		<div className="rounded-lg flex-col items-center justify-center flex grow bg-gray-200">
			<div className="flex flex-col items-center justify-center w-full bg-gray-300 rounded-t-lg p-3">
				<div className="flex justify-end w-full">
					<ColoredPill color="green">
						{Percentage}%
						<ArrowTrendingUpIcon className="w-5 h-5 ml-1" />
					</ColoredPill>
				</div>
				<div className="text-5xl -mt-3 font-bold">{LetterGrade}</div>
			</div>
			<div className="m-3">{ClassName}</div>
		</div>
	);
};

export { GradeSummaryComponent };

const RecentlyGraded: React.FC<RecentlyGradedProps> = ({
	AssignmentName,
	ClassName,
	Points,
	ClassColor,
}) => {
	return (
		<div className="rounded-lg items-center flex grow p-3 bg-gray-200 justify-between">
			<div className="line-clamp-1">{AssignmentName}</div>
			<div className="flex items-center justify-center space-x-3">
				<ColoredPill color={ClassColor}>{ClassName}</ColoredPill>
				<div className="font-bold">{Points}</div>
			</div>
		</div>
	);
};

export { RecentlyGraded };

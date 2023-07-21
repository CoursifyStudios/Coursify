import GPA, {
	GradeSummaryComponent,
	RecentlyGraded,
} from "@/components/grades/gradespage";
import {
	FetchedGradesType,
	fetchClassGrades,
	fetchGrades,
} from "@/lib/db/grades";
import { ArrowTrendingDownIcon } from "@heroicons/react/24/outline";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { NextPage } from "next";
import { useEffect, useState } from "react";

const GradesOverview: NextPage = () => {
	const user = useUser();
	const supabase = useSupabaseClient();
	const [recentlyGraded, setRecentlyGraded] = useState();
	useEffect(() => {
		(async () => {
			if (user) {
				const gradeData = await fetchGrades(supabase, user.id);

				//console.log(gradeData);
				if (gradeData && gradeData[0] && gradeData[1]) {
					//setRecentlyGraded(gradeData[0].data)
				}
			}
		})();
	});
	return (
		<div className="mx-auto flex w-full max-w-screen-xl flex-col px-4 py-2">
			<h1 className="title pt-4">Grades</h1>
			<div className="flex w-full flex-col">
				<h2 className="font-semibold text-lg mt-4">Overview</h2>
				<div className="bg-gray-200 rounded-lg my-2 w-full flex justify-between">
					<div className="flex space-x-6">
						<GPA gpatype="Unweighted" gpa="3.92" />
						<GPA gpatype="Weighted" gpa="4.23" />
						<GPA gpatype="UC GPA" gpa="4.02" />
					</div>
					<div className="m-2 flex flex-col items-center justify-center space-x-2 p-4">
						<div className="flex items-center justify-center space-x-3">
							<h1 className="text-6xl font-bold">3</h1>
							<ArrowTrendingDownIcon className="h-8 w-8 text-green-400" />
						</div>
						<p>Missing Assignments</p>
					</div>
				</div>
				<div className="flex w-full">
					<div className="w-1/2 shrink-0">
						<h1 className="font-semibold text-lg mt-4">All Grades</h1>
						<div className="grid gap-6 grid-cols-2 mt-2">
							<GradeSummaryComponent
								ClassName="World History 1,2"
								LetterGrade="A"
								Percentage="93"
							/>
							<GradeSummaryComponent
								ClassName="Mindfulness"
								LetterGrade="C"
								Percentage="75"
							/>
							<GradeSummaryComponent
								ClassName="Japanese"
								LetterGrade="B"
								Percentage="89"
							/>
						</div>
					</div>
					<div className="flex w-full ml-6 flex-col">
						<h1 className="font-semibold text-lg mt-4">Recently Graded</h1>
						<div className="flex flex-col space-y-3 mt-2">
							<RecentlyGraded
								AssignmentName="Write an essay about the Ming Empire"
								ClassName="World History"
								Points="20/20"
								ClassColor="yellow"
							/>
							<RecentlyGraded
								AssignmentName="Write 50 Kanji"
								ClassName="Japanese"
								Points="32/50"
								ClassColor="red"
							/>
							<RecentlyGraded
								AssignmentName="Prove that gravity exists"
								ClassName="Physics"
								Points="15/17"
								ClassColor="purple"
							/>
							<RecentlyGraded
								AssignmentName="Spell Mindfulness correctly"
								ClassName="Mindfulness"
								Points="60/100"
								ClassColor="orange"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GradesOverview;

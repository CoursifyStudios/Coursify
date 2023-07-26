import GPA, {
	GradeSummaryComponent,
	RecentlyGraded,
} from "@/components/grades/gradespage";
import { FetchedGradesType, fetchGrades } from "@/lib/db/grades";
import { ArrowTrendingDownIcon } from "@heroicons/react/24/outline";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { NextPage } from "next";
import { useEffect, useState } from "react";

const GradesOverview: NextPage = () => {
	const user = useUser();
	const supabase = useSupabaseClient();
	const [classgrades, setClassGrades] =
		useState<FetchedGradesType[1]["data"]>();
	const [recentlyGraded, setRecentlyGraded] =
		useState<FetchedGradesType[0]["data"]>();
	useEffect(() => {
		(async () => {
			if (user) {
				const gradeData = await fetchGrades(supabase, user.id);

				if (gradeData && gradeData[0].data && gradeData[1].data) {
					setRecentlyGraded(gradeData[0].data);
					setClassGrades(gradeData[1].data);
				}
			}
		})();
	}, [supabase, user]);
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
							{classgrades &&
								classgrades.map(
									(classObject) =>
										classObject.classes && (
											<GradeSummaryComponent
												key={classObject.classes.id}
												ClassName={classObject.classes.name}
												LetterGrade={"A"} //TODO: fix
												Percentage={"93"} //TODO: fix
											></GradeSummaryComponent>
										)
								)}
						</div>
					</div>
					<div className="flex w-full ml-6 flex-col">
						<h1 className="font-semibold text-lg mt-4">Recently Graded</h1>
						<div className="flex flex-col space-y-3 mt-2">
							{recentlyGraded &&
								recentlyGraded.map(
									(gradedAssignment) =>
										gradedAssignment.assignments &&
										gradedAssignment.assignments.classes && (
											<RecentlyGraded
												key={gradedAssignment.assignments?.id}
												AssignmentName={gradedAssignment.assignments?.name}
												ClassName={gradedAssignment.assignments.classes?.name}
												Points={
													gradedAssignment.grade +
													"/" +
													gradedAssignment.assignments.max_grade
												}
												ClassColor={gradedAssignment.assignments.classes?.color}
											></RecentlyGraded>
										)
								)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
	//TODO: adjustable letter grade ranges
	function getLetterGrade(percentGrade: number) {
		if (percentGrade >= 90) return "A";
		if (percentGrade >= 80) return "B";
		if (percentGrade >= 70) return "C";
		if (percentGrade >= 60) return "D";
		return "F";
	}
};

export default GradesOverview;

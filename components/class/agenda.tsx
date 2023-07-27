export const Agenda = ({
	date,
	description,
	assignments,
}: {
	date: Date;
	description: string;
	assignments: {
		name: string;
		description: string;
		id: string;
		due_type: number | null;
		due_date: string | null;
	}[];
}) => {
	return (
		<div className="bg-gray-200 p-4">
			<h2>Agenda for {date.toLocaleDateString()}</h2>
			<p>{description}</p>
			{assignments.map((assignment) => (
				<div key={assignment.id} className="flex justify-between">
                    <p className="font-semibold">{assignment.name}</p>
                    <p>Due: {assignment.due_date}</p>
                </div>
			))}
		</div>
	);
};

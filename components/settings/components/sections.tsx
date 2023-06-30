import { NextPage } from "next";
import Betatag from "../../misc/betatag";
import Dropdown from "../../misc/dropdown";
import { Toggle } from "../../misc/toggle";

export const ToggleSection: NextPage<{
	description: string;
	name: string;
	enabled: boolean;
	setEnabled: (value: boolean) => void;
	beta?: boolean;
}> = ({ name, description, enabled, setEnabled, beta = false }) => {
	return (
		<div className="mt-4 flex grow justify-between">
			<div>
				<div className="mb-1 flex items-center">
					<h4 className="mr-3 font-medium">{name}</h4>
					<div className={`${!beta && "invisible"} flex items-center `}>
						<Betatag />
					</div>
				</div>
				<p className="max-w-xl text-sm text-gray-700">{description}</p>
			</div>
			<Toggle enabled={enabled} setEnabled={setEnabled} />
		</div>
	);
};

function Test<T>() {}

export function DropdownSection<T = string | number>({
	name,
	description,
	currentValue,
	onChange,
	beta = false,
	values,
}: {
	description: string;
	name: string;
	currentValue:
		| {
				name: string;
				id: string;
		  }
		| string
		| number;
	type?: T;
	values: {
		name: string;
		id: string | number;
	}[];
	onChange: (value: { name: string; id: T }) => void;
	beta?: boolean;
}) {
	return (
		<div className="mt-4 flex grow  justify-between">
			<div>
				<div className="mb-1 flex items-center">
					<h4 className="mr-3 font-medium">{name}</h4>
					<div className={`${!beta && "invisible"} flex items-center `}>
						<Betatag />
					</div>
				</div>
				<p className="max-w-xl text-sm text-gray-700">{description}</p>
			</div>
			<Dropdown
				onChange={onChange}
				selectedValue={
					typeof currentValue == "string" || typeof currentValue == "number"
						? values.find((v) => v.id == currentValue)!
						: currentValue
				}
				values={values}
				className="w-40"
			/>
		</div>
	);
}

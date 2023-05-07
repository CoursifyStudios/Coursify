import { NextPage } from "next";
import { ReactNode } from "react";
import { Toggle } from "../../misc/toggle";
import Betatag from "../../misc/betatag";

export const ToggleSection: NextPage<{
	description: string;
	name: string;
	enabled: boolean;
	setEnabled: (value: boolean) => void;
	beta?: boolean;
}> = ({ name, description, enabled, setEnabled, beta = false }) => {
	return (
		<div className="flex grow justify-between">
			<div>
				<div className="mb-1 flex items-center">
					<h4 className="mr-3 font-medium">{name}</h4>
					<div className={`${!beta && "invisible"} flex items-center `}>
						<Betatag />
					</div>
				</div>
				<p className="max-w-md text-sm text-gray-700">{description}</p>
			</div>
			<Toggle enabled={enabled} setEnabled={setEnabled} />
		</div>
	);
};

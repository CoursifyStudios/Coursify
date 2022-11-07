import { useUser } from "@supabase/auth-helpers-react";
import type { ReactNode } from "react";
import {
	CalendarIcon,
	MagnifyingGlassIcon,
	MegaphoneIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
const tabs: Tab[] = [
    {
        name: "Home",
        selected: false,
    },
    {
        name: "Assignments",
        selected: false,
    },
];
export default function Navbar() {
	const user = useUser();
	

	return (
		<nav className="flex items-center justify-between bg-gray-200 px-8 py-2.5">
			<div className="flex items-center space-x-6">
				{tabs.map((v, i) => (
                    <>
                        <Link href={useThis(v.name)}>
                            <div
                                key={i}
                                className={`my-0.5  rounded-md ${
                                    v.selected ? "bg-gray-50 shadow-md" : "bg-gray-300"
                                } px-3 py-0.5 text-lg font-semibold `}
                            >
                                {v.name}
                            </div>
                        </Link>

                        {i == 1 && (
                            <div className="graydient h-10 w-[0.07rem]" key={-1}></div>
                        )}
                        
                    </>
				))}
			</div>

			<div className="flex flex-row-reverse items-center space-x-4 space-x-reverse">
				{user ? (
					<>
						<img
							src={user.user_metadata.picture}
							className="!ml-2 h-10 rounded-full shadow-md shadow-black/25"
						/>
						<ButtonIcon
							icon={<MegaphoneIcon className="h-6 w-6" />}
							to="/announcements"
						/>
						<ButtonIcon
							icon={<CalendarIcon className="h-6 w-6" />}
							to="/calendar"
						/>
						<ButtonIcon icon={<MagnifyingGlassIcon className="p- h-6 w-6" />} />
					</>
				) : (
					<div className="bg-blue-500 px-4 py-1 font-medium text-white">
						Login
					</div>
				)}
			</div>
		</nav>
	);

    
}
function useThis (tabName: string) {
    if (tabName == "Home") {
        return "/";
    } else {
        return tabName;
    }
}

export function changeTabFocus (tabIndex: number) {
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].selected = false;
        console.log(tabs);
    }
    tabs[tabIndex].selected = true;
}

interface Tab {
	//this is temp, see the tabs rfc here for the proposal: https://docs.google.com/document/d/1oAc1VBBhF7aVSQeesqvNN4Wb8J4m-aJBoMPG1vLyVZs/edit
	name: string;
	selected: boolean;
}

function ButtonIcon(props: { icon: ReactNode; to?: string; classes?: string }) {
	const r = (
		<div
			className={
				"grid h-9 w-9 place-items-center rounded-full bg-gray-300 text-gray-800 " +
				props.classes
			}
		>
			{props.icon}
		</div>
	);

	if (props.to) {
		return <Link href={props.to}>{r}</Link>;
	} else {
		return r;
	}
}

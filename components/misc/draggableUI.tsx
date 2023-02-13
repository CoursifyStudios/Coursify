// By IllGive / Bill Smith
// As of: Thursday, 9 February 2023
// Started Tuesday, 7 February 2023

import { NextPage } from "next";
import { ReactInstance, ReactNode, useRef } from "react";

export const DragZone: NextPage<{
	id: string; //Only use lowercase
	children: ReactNode;
	parent: ReactInstance;
	offsetByParentElementWidth: boolean; //false if you want element to appear right of the mouse when dragged, and true for left (logical, I know).
}> = ({ id, children, parent, offsetByParentElementWidth }) => {
	return (
		<div
			draggable={true}
			onDragStart={(e) => {
				e.dataTransfer.setDragImage(
					parent as Element,
					offsetByParentElementWidth ? (parent as Element).clientWidth : 0,
					0
				);
				e.dataTransfer.setData(id, "");
			}}
		>
			{children}
		</div>
	);
};

export const DropZone: NextPage<{
	id: string;
	children: ReactNode;
	setPreviewState?: (value: boolean) => void;
	setUIState: (value: boolean) => void;
	uIState: boolean;
}> = ({ id, children, setPreviewState, setUIState, uIState }) => {
	const dropZoneRef = useRef<HTMLDivElement>(null);
	return (
		<div
			ref={dropZoneRef}
			onDragOver={(e) => {
				if (e.dataTransfer.types.includes(id)) {
					e.preventDefault();
					setPreviewState ? setPreviewState(true) : {};
				}
			}}
			onDragEnter={(e) => {
				if (e.dataTransfer.types.includes(id)) {
					e.preventDefault();
					setPreviewState ? setPreviewState(true) : {};
				}
			}}
			onDragLeave={() => {
				setPreviewState ? setPreviewState(false) : {};
			}}
			onDrop={(e) => {
				if (e.dataTransfer.types.includes(id)) {
					setPreviewState ? setPreviewState(false) : {};
					setUIState(!uIState);
				}
			}}
		>
			{children}
		</div>
	);
};

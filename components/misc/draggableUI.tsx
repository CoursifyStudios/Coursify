// By IllGive / Bill Smith
// As of: Thursday, 9 February 2023
// Started Tuesday, 7 February 2023

import { NextPage } from "next";
import { ReactInstance, ReactNode, SetStateAction } from "react";
import ReactDOM from "react-dom";

export const DragZone: NextPage<{
    id: string; //potential massive security issue, don't put sensitive info in here
    children: ReactNode;
    parent: ReactInstance;
    offsetByParentElementWidth: boolean; //false if you want element to appear right of the mouse when dragged, and true for left (logical, I know).
}> = ({id, children, parent, offsetByParentElementWidth}) => {
    return (
        <div
            draggable={true}
            onDragStart={(e) => {
                e.dataTransfer.setDragImage(
                    ReactDOM.findDOMNode(parent) as Element, 
                    offsetByParentElementWidth? (ReactDOM.findDOMNode(parent) as Element).clientWidth: 0, 
                    0)
                e.dataTransfer.setData(id, "")
            }}
        >
            {children}
        </div>
    )
}

export const DropZone: NextPage<{
    id: string;
    children: ReactNode;
    setPreviewState: (value: boolean) => void;
    setUIState: (value: boolean) => void;
    uIState: boolean;
}> = ({id, children, setPreviewState, setUIState, uIState }) => {
    return (
        <div
            onDragOver={(e) => {
                if (e.dataTransfer.types.includes(id)) {
                    e.preventDefault(); 
                    setPreviewState(true);
                }
                }}
            onDragEnter={(e) => { 
                if (e.dataTransfer.types.includes(id)) {
                    e.preventDefault(); 
                    setPreviewState(true);
                }
            }}
            onDragLeave={() =>{setPreviewState(false)}}
            onDrop={(e) => {
                if (e.dataTransfer.types.includes(id)) {
                    setPreviewState(false);
                    setUIState(!uIState);
                }
            }}
        >
            {children}
        </div>
    );
};
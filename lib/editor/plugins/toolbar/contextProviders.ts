import { LexicalEditor } from "lexical";
import React, { createContext } from "react";

interface IEditorContext {
	initialEditor: LexicalEditor;
	activeEditor: LexicalEditor;
	setActiveEditor: React.Dispatch<React.SetStateAction<LexicalEditor>>;
}

//@ts-expect-error
export const EditorContext = createContext<IEditorContext>();

interface IToolbarContext {
	isRTL: boolean;
	isBold: boolean;
	isItalic: boolean;
	isUnderline: boolean;
	isCode: boolean;
	isLink: boolean;
	isStrikethrough: boolean;
	isSubscript: boolean;
	isSuperscript: boolean;
	canUndo: boolean;
	canRedo: boolean;
	fontFamily: string;
	fontSize: string;
	fontColor: string;
	bgColor: string;
	blockType: string;
	codeLanguage: string;
	selectedElementKey?: string;
	applyStyleText: (styles: Record<string, string>) => void;
	insertLink: () => void;
}

//@ts-expect-error
export const ToolbarContext = createContext<IToolbarContext>();

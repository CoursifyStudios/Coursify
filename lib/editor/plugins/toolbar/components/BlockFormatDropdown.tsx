import { $createCodeNode } from "@lexical/code";
import {
	INSERT_CHECK_LIST_COMMAND,
	INSERT_ORDERED_LIST_COMMAND,
	INSERT_UNORDERED_LIST_COMMAND,
	REMOVE_LIST_COMMAND,
} from "@lexical/list";
import {
	$createHeadingNode,
	$createQuoteNode,
	HeadingTagType,
} from "@lexical/rich-text";
import { $wrapNodes } from "@lexical/selection";
import {
	$createParagraphNode,
	$getSelection,
	$isRangeSelection,
} from "lexical";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { ToolbarContext, EditorContext } from "../contextProviders";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";

const BlockFormatDropdown = () => {
	const { initialEditor } = useContext(EditorContext);
	const { blockType } = useContext(ToolbarContext);
	const formatParagraph = () => {
		if (blockType !== "paragraph") {
			initialEditor.update(() => {
				const selection = $getSelection();

				if ($isRangeSelection(selection)) {
					$wrapNodes(selection, () => $createParagraphNode());
				}
			});
		}
	};

	const formatHeading = (headingSize: HeadingTagType) => {
		if (blockType !== headingSize) {
			initialEditor.update(() => {
				const selection = $getSelection();

				if ($isRangeSelection(selection)) {
					$wrapNodes(selection, () => $createHeadingNode(headingSize));
				}
			});
		}
	};

	const formatBulletList = () => {
		if (blockType !== "bullet") {
			initialEditor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
		} else {
			initialEditor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
		}
	};

	const formatCheckList = () => {
		if (blockType !== "check") {
			initialEditor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
		} else {
			initialEditor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
		}
	};

	const formatNumberedList = () => {
		if (blockType !== "number") {
			initialEditor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
		} else {
			initialEditor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
		}
	};

	const formatQuote = () => {
		if (blockType !== "quote") {
			initialEditor.update(() => {
				const selection = $getSelection();

				if ($isRangeSelection(selection)) {
					$wrapNodes(selection, () => $createQuoteNode());
				}
			});
		}
	};

	const formatCode = () => {
		if (blockType !== "code") {
			initialEditor.update(() => {
				const selection = $getSelection();

				if ($isRangeSelection(selection)) {
					if (selection.isCollapsed()) {
						$wrapNodes(selection, () => $createCodeNode());
					} else {
						const textContent = selection.getTextContent();
						const codeNode = $createCodeNode();
						selection.removeText();
						selection.insertNodes([codeNode]);
						selection.insertRawText(textContent);
					}
				}
			});
		}
	};

	const blocks: { name: string; id: string; func: () => void }[] = [
		{
			name: "Paragraph",
			id: "paragraph",
			func: formatParagraph,
		},
		{
			name: "Heading 1",
			id: "h1",
			func: () => formatHeading("h1"),
		},
		{
			name: "Heading 2",
			id: "h2",
			func: () => formatHeading("h2"),
		},
		{
			name: "Heading 3",
			id: "h3",
			func: () => formatHeading("h3"),
		},
		{
			name: "Bullet List",
			id: "bullet",
			func: formatBulletList,
		},
		{
			name: "Numbered List",
			id: "number",
			func: formatNumberedList,
		},
		// {
		// 	name: "Check List",
		// 	id: "check",
		// 	func: formatCheckList,
		// },
		{
			name: "Quote",
			id: "quote",
			func: formatQuote,
		},
		{
			name: "Code Block",
			id: "code",
			func: formatCode,
		},
	];

	const [selectedBlock, setSelectedBlock] = useState<{
		name: string;
		id: string;
		func: () => void;
	}>(blocks[0]);
	const setBlock = (block: { name: string; id: string; func: () => void }) => {
		setSelectedBlock(block);
		block.func();
	};
	useEffect(() => {
		setSelectedBlock(
			blocks.find((block) => blockType == block.id) || blocks[1]
		);
	}, [blockType, blocks]);

	return (
		<Listbox
			value={selectedBlock}
			onChange={setBlock}
			as="div"
			className="z-50 flex flex-col"
		>
			<Listbox.Button className=" flex items-center rounded py-1 px-2 text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-800">
				{selectedBlock.name}
				<ChevronUpDownIcon className="ml-1 h-5 w-5" />
			</Listbox.Button>
			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom=" opacity-0 scale-95 -translate-y-2"
				enterTo=" opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom=" opacity-100 scale-100"
				leaveTo=" opacity-0 scale-95 -translate-y-2"
			>
				<Listbox.Options className="absolute mt-10 space-y-2 rounded-xl bg-gray-200/75 px-2 py-2 shadow-xl backdrop-blur-3xl">
					{blocks.map((block, i) => (
						<Listbox.Option
							key={i}
							value={block}
							className="cursor-pointer rounded px-2 py-1 text-sm font-medium hover:bg-gray-300/75 disabled:text-gray-500 disabled:hover:bg-transparent"
						>
							{block.name}
						</Listbox.Option>
					))}
				</Listbox.Options>
			</Transition>
		</Listbox>
	);
};

export default BlockFormatDropdown;

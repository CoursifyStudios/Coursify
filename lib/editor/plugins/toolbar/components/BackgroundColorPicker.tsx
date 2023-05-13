import { useCallback, useContext } from "react";
import { ToolbarContext } from "../contextProviders";
//import ColorPicker from '../../../ui/ColorPicker';

const BackgroundColorPicker = () => {
	const { bgColor, applyStyleText } = useContext(ToolbarContext);

	const onBgColorSelect = useCallback(
		(value: string) => {
			applyStyleText({ "background-color": value });
		},
		[applyStyleText]
	);

	return (
		// <ColorPicker
		//   buttonClassName="toolbar-item color-picker"
		//   buttonAriaLabel={t('toolbar:backgroundColorPicker.Description')}
		//   buttonIconClassName="icon bg-color"
		//   color={bgColor}
		//   onChange={onBgColorSelect}
		//   title="bg color"
		// />
		"color picker"
	);
};

export default BackgroundColorPicker;

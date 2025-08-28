export type ChoiceFormat = {
	btnColor: string;
	btnTextColor: string;
	btnFont: string;
}

export type TextFormat = {
	textColor: string;
	textFont: string;
}

export type Format = ChoiceFormat & TextFormat & {
	background: string;
	page: string;
};

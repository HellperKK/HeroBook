export type ChoiceFormat = {
	btnColor: string;
	btnTextColor: string;
	btnFont: string;
}

export type Format = ChoiceFormat &{
	textColor: string;
	textFont: string;
	background: string;
	page: string;
};

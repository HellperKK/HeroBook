export type ChoiceFormat = {
  btnColor: string;
  btnTextColor: string;
  btnFont: string;
};

export type TextFormat = {
  textColor: string;
  textFont: string;
};

export type MediaFormat = {
  width: string;
  height: string;
};

export type Format = ChoiceFormat &
  TextFormat &
  MediaFormat & {
    background: string;
    page: string;
  };

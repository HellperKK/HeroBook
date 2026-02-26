import type { ChoiceFormat, MediaFormat, TextFormat } from './Format';

type BlockBase = {
  id: number;
};
export type ChoiceBlock = BlockBase & {
  type: 'choice';
  text: string;
  pageId: number;
  action: string;
  condition: string; 
  format: Partial<ChoiceFormat>;
};

export type TextBlock = BlockBase & {
  type: 'text';
  content: string;
  format: Partial<TextFormat>;
};
export type Block =
  | TextBlock
  | (BlockBase & {
      type: 'image';
      path: string;
      format: Partial<MediaFormat>;
    })
  | (BlockBase & {
      type: 'video';
      path: string;
      format: Partial<MediaFormat>;
    })
  | ChoiceBlock;

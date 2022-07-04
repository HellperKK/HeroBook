import { useState } from 'react';

import { useSelector } from 'react-redux';

import { identity } from '../../utils/utils';
import { findPage } from '../../utils/page';
import { State } from '../../utils/state';

import GameViewer from './GameViewer';

interface CompProp {
  start: number;
}

export default function GameWindow(props: CompProp) {
  const { game } = useSelector<State, State>(identity);

  const { start } = props;
  const [currentPage, setCurrentPage] = useState(start);

  const truePage = findPage(game.pages, currentPage);

  return (
    <GameViewer
      page={truePage}
      onClick={(choice) => setCurrentPage(choice.pageId)}
    />
  );
}

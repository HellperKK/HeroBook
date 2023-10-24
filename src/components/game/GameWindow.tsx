import { useSelector } from "react-redux";
import { useState } from "react";

import { findPage } from "../../utils/page";
import { Choice } from "../../utils/initialStuff";

import GameViewer from "./GameViewer";
import { RootState } from "../../store/store";

interface CompProp {
  start: number;
}

export default function GameWindow(props: CompProp) {
  const { game } = useSelector((state: RootState) => state.game);

  const { start } = props;
  const [currentPage, setCurrentPage] = useState(start);

  const truePage = findPage(game.pages, currentPage);
  const changePage = (choice: Choice) => {
    setCurrentPage(choice.pageId);
  };

  return <GameViewer page={truePage} onClick={changePage} />;
}

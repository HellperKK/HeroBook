import { useSelector } from "react-redux";
import { useState } from "react";

import { identity } from "../utils/utils";
import { findPage } from "../utils/page";
import { State } from "../utils/state";
import { Choice } from "../utils/initialStuff";

import GameViewer from "./GameViewer";

interface CompProp {
  start: number;
}

export default function GameWindow(props: CompProp) {
  const { game } = useSelector<State, State>(identity);

  const { start } = props;
  const [currentPage, setCurrentPage] = useState(start);

  const truePage = findPage(game.pages, currentPage);
  const changePage = (choice: Choice) => {
    setCurrentPage(choice.pageId);
  };

  return <GameViewer page={truePage} onClick={changePage} />;
}

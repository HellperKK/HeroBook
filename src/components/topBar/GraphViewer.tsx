/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import G6 from "@antv/g6";

import { pageIsLinked } from "../../utils/page";
import { Choice, Page } from "../../utils/initialStuff";
import { RootState } from "../../store/store";

export default function GraphViewer() {
  const { game } = useSelector((state: RootState) => state.game);

  const nodeName = (page: Page) => `${page.name} (${page.id})`;

  const nodeColor = (page: Page) => {
    if (page.isFirst) return "#70ff7e";
    if (!pageIsLinked(game.pages, page)) return "#ff8170";

    return "#8fddff";
  };

  const nodes: any[] = [];
  const edges: any[] = [];

  game.pages.forEach((page) => {
    nodes.push({
      id: page.id.toString(),
      label: nodeName(page),
      style: { fill: nodeColor(page) },
    });
    page.next.forEach((nex: Choice) => {
      edges.push({
        source: page.id.toString(),
        target: nex.pageId.toString(),
        label: "", /*nex.action,*/
      });
    });
  });

  const loadGraph = () => {
    // graph.data(data);

    (document.querySelector("#graph-container") as HTMLElement).innerHTML = "";

    const graph = new G6.Graph({
      container: "graph-container",
      width: window.innerWidth,
      height: window.innerHeight - 100,
      layout: {
        type: "circular",
        radius: 200,
        startRadius: 10,
        endRadius: 100,
        clockwise: false,
        divisions: 5,
        ordering: "degree",
        angleRatio: 1,
      },
      defaultNode: {
        size: 40,
      },
      defaultEdge: {
        style: {
          endArrow: true,
        },
      },
      modes: {
        default: ["drag-canvas", "zoom-canvas"],
        edit: ["click-select"],
      },
    });
    graph.data({ nodes, edges });
    graph.render();
  };

  setTimeout(loadGraph, 100);

  return (
    <div>
      <div id="graph-container" />
    </div>
  );
}

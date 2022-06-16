/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from 'react-redux';
import G6 from '@antv/g6';

import { identity } from '../../utils/utils';
import { State } from '../../utils/state';
import { Choice, Page } from '../../utils/initialStuff';

export default function GraphViewer() {
  const { game } = useSelector<State, State>(identity);

  const nodeName = (page: Page) => `${page.name} (${page.id})`;

  const pagesDict = new Map<number, Page>();
  const nodes: any[] = [];
  const edges: any[] = [];

  game.pages.forEach((page) => {
    pagesDict.set(page.id, page);
  });

  game.pages.forEach((page) => {
    nodes.push({
      id: nodeName(page),
      label: nodeName(page),
      style: { fill: page.isFirst ? '#70ff7e' : '#8fddff' },
    });
    page.next.forEach((nex: Choice) => {
      edges.push({
        source: nodeName(page),
        target: nodeName(pagesDict.get(nex.pageId) as Page),
        label: nex.action,
      });
    });
  });

  const loadGraph = () => {
    // graph.data(data);

    (document.querySelector('#graph-container') as HTMLElement).innerHTML = '';

    const graph = new G6.Graph({
      container: 'graph-container',
      width: window.innerWidth,
      height: window.innerHeight - 100,
      layout: {
        type: 'circular',
        radius: 200,
        startRadius: 10,
        endRadius: 100,
        clockwise: false,
        divisions: 5,
        ordering: 'degree',
        angleRatio: 1,
      },
      defaultNode: {
        type: 'arc',
        size: 40,
      },
      defaultEdge: {
        style: {
          endArrow: true,
        },
      },
      modes: {
        // 支持的 behavior
        default: ['drag-canvas', 'zoom-canvas'],
        edit: ['click-select'],
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

import Graph from "react-graph-vis";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../store/store";

export default function GraphPage() {
	const navigate = useNavigate();
	const {
		pages,
		settings: { firstPage },
	} = useSelector((state: RootState) => state.project);
	const nodes = [];
	const edges = [];

	for (const page of pages) {
		nodes.push({
			id: page.id,
			label: page.name,
			title: page.name,
			color: page.id === firstPage ? "#83d383" : "#d38383",
			font: {
				size: 25,
				color: "#000000",
			},
		});

		for (const block of page.content) {
			if (block.type === "choice") {
				edges.push({
					from: page.id,
					to: block.pageId,
				});
			}
		}
	}
	const options = {
		layout: {
			hierarchical: false,
		},
		edges: {
			color: "#000000",
		},
		height: "100%",
	};

	const events = {
		// biome-ignore lint/suspicious/noExplicitAny: no types from lib
		doubleClick: (event: any) => {
			var { nodes, _edges } = event;
			if (nodes.length === 0) return;
			navigate(`/editor/page/${nodes[0]}`);
		},
	};
	return <Graph graph={{ nodes, edges }} options={options} events={events} />;
}

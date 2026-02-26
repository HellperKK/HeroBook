import { type ReactElement, useState } from "react";
import { reactElementToArray } from "../../../utils/reactNodeToArray";

import "./tabs.scss";

type Props = { children?: ReactElement | ReactElement[] };

export default function Tabs({ children }: Props) {
	const saneChildren = reactElementToArray(children);
	const titles = saneChildren.map((children) => (children.props as {title?: string}).title);

	if (titles.includes(undefined)) {
		console.error(
			`Tab title is not defined on index ${titles.indexOf(undefined)}`,
		);
	}

	const [activeTab, setActiveTab] = useState(0);

	return (
		<div className="tabs">
			<div className="tabs-titles">
				{titles.map((title, index) => (
					<button
            type="button"
						className={`tabs-link${index === activeTab ? " tabs-link-active" : ""}`}
						key={title}
						onClick={() => setActiveTab(index)}
					>
						{title}
					</button>
				))}
			</div>
			<div className="tabs-content">{saneChildren[activeTab]}</div>
		</div>
	);
}

import { type ReactElement, useState } from "react";
import { reactElementToArray } from "../../../utils/reactNodeToArray";
import "./tabs.scss";

type Props = {
	children?: ReactElement | ReactElement[];
	onTabClose?: (index: number) => void;
};

export default function FileTabs({ children, onTabClose }: Props) {
	const saneChildren = reactElementToArray(children);
	const titles = saneChildren.map(
		(children) => (children.props as { title?: string }).title,
	);

	if (titles.includes(undefined)) {
		console.error(
			`Tab title is not defined on index ${titles.indexOf(undefined)}`,
		);
	}

	const [activeTab, setActiveTab] = useState(0);

	return (
		<div className="file-tabs">
			<div className="tabs-titles">
				{titles.map((title, index) => (
					<div
						key={title}
						className={`tabs-link${index === activeTab ? " tabs-link-active" : ""}`}
					>
						<button
							type="button"
							onClick={() => setActiveTab(index)}
						>
							{title}
						</button>
						<button
							className="tabs-close"
							type="button"
							onClick={() => {
								if (onTabClose === undefined) {
                  return;
								}
								
                if (index === activeTab && index > 0) {
                  setActiveTab(index - 1);
                }

                onTabClose(index);
							}}
						>
							X
						</button>
					</div>
				))}
			</div>
			<div className="tabs-content">{saneChildren[activeTab]}</div>
		</div>
	);
}

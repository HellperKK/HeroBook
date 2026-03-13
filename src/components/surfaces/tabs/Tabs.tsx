import { type ReactElement, useState } from 'react';
import { reactElementToArray } from '../../../utils/reactNodeToArray';
import './tabs.scss';
import Button from '../../inputs/button/Button';

type Element = ReactElement<{ title: string; disabled?: boolean }>;
type Props = { children?: Element | Element[] };

export default function Tabs({ children }: Props) {
  const saneChildren: Element[] = reactElementToArray(children);
  const props = saneChildren.map((child) => child.props);

  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="tabs">
      <div className="tabs-titles">
        {props.map((prop, index) => (
          <Button
            type="button"
            className={`tabs-link${index === activeTab ? ' tabs-link-active' : ''}`}
            key={prop.title}
            onClick={() => setActiveTab(index)}
            disabled={prop.disabled}
          >
            {prop.title}
          </Button>
        ))}
      </div>
      <div className="tabs-content">{saneChildren[activeTab]}</div>
    </div>
  );
}

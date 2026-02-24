import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import type { RootState } from '../../store/store';
import RenderBlock from './blocks/RenderBlock';
import './play.scss'

export default function Play() {
  const navigate = useNavigate();
  const params = useParams();
  const {
    pages,
    settings: { format },
  } = useSelector((state: RootState) => state.project);

  // biome-ignore lint/style/noNonNullAssertion: will allways work
  const id = +params.id!;
  // biome-ignore lint/style/noNonNullAssertion: will allways work
  const page = pages.find((page) => page.id === id)!;

  return (
    <div className="play">      
      <div
        className="game-outer"
        style={{
          backgroundColor: page.format?.background ?? format.background,
        }}
      >
        <div className="game-inner" style={{ backgroundColor: page.format?.page ?? format.page }}>
          {page.content.map((block) => (
            <div className="block-pair" key={block.id}>
              <RenderBlock  block={block} onClick={(id) => navigate(`/play/page/${id}`)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import type { RootState } from '../../store/store';
import RenderBlock from './blocks/RenderBlock';
import './play.scss';
import Jinter from 'jintr';
import { useImmer } from 'use-immer';

export default function Play() {
  const navigate = useNavigate();
  const params = useParams();
  const {
    pages,
    settings: { format, texts, firstPage, gameTitle, author, startScript },
  } = useSelector((state: RootState) => state.project);

  // biome-ignore lint/suspicious/noExplicitAny: safe any
  const [state, setState] = useImmer<any>({});

  console.log(state);

  // biome-ignore lint/style/noNonNullAssertion: will allways work
  const id = +params.id!;

  if (id === 0) {
    return (
      <div className="play">
        <div
          className="game-outer"
          style={{
            backgroundColor: format.background,
          }}
        >
          <div className="game-inner" style={{ backgroundColor: format.page }}>
            <h1>{gameTitle}</h1>
            by {author}
            <div className={`button-choice`}>
              <button
                type="button"
                style={{
                  backgroundColor: format.btnColor,
                  color: format.btnTextColor,
                  fontFamily: format.btnFont,
                }}
                onClick={() => {
                  // biome-ignore lint/suspicious/noExplicitAny: safe any
                  setState((draft: any) => {
                    const jinter = new Jinter();
                    jinter.defineObject('$state', draft);
                    jinter.evaluate(startScript);
                  });
                  navigate(`/play/page/${firstPage}`);
                }}
              >
                {texts.play}
              </button>
            </div>
            <div className={`button-choice`}>
              <button
                type="button"
                style={{
                  backgroundColor: format.btnColor,
                  color: format.btnTextColor,
                  fontFamily: format.btnFont,
                }}
                onClick={() => {
                  navigate(`/play/open`);
                }}
              >
                {texts.quit}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <RenderBlock block={block} onClick={(id) => navigate(`/play/page/${id}`)} state={state}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

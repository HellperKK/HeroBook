import { useState } from 'react';
import Button from '../../components/inputs/button/Button';
import './editor.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ColorPicker from '../../components/inputs/colorPicker/ColorPicker';
import TextField from '../../components/inputs/textField/TextField';
import Toggle from '../../components/inputs/toggle/Toggle';
import Accordion from '../../components/surfaces/accordion/Accordion';
import TabPannel from '../../components/surfaces/tabs/TabPannel';
import Tabs from '../../components/surfaces/tabs/Tabs';
import Label from '../../components/texts/label/Label';
import { changeGlobalSettings } from '../../store/projectSlice';
import type { RootState } from '../../store/store';
import { allowedFonts } from '../../utils/game/allowedFonts';
import RenderBlock from './blocks/RenderBlock';
import JsCodeEditor from './jsCodeEditor/JsCodeEditor';
import GlobalStyleEdition from './styleEdition/GlobalStyleEdition';
import PageStyleEdition from './styleEdition/PageStyleEdition';

export default function Editor() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const {
    pages,
    settings: { format, gameTitle, author, expert, firstPage, startScript },
  } = useSelector((state: RootState) => state.project);
  const [leftToggle, setLeftToggle] = useState(false);
  const [rightToggle, setRightToggle] = useState(false);

  // biome-ignore lint/style/noNonNullAssertion: will allways work
  const page = pages.find((page) => page.id === +params.id!)!;

  const leftSize = leftToggle ? '400px' : '70px';
  const rightSize = rightToggle ? '400px' : '70px';

  return (
    <div className="editor" style={{ gridTemplateColumns: `${leftSize} 1fr ${rightSize}` }}>
      <div className="editor-leftbar">
        <Button onClick={() => setLeftToggle((toggled) => !toggled)}>{leftToggle ? 'Close' : 'Open'}</Button>
        {leftToggle && (
          <>
            <Button type="button" onClick={() => navigate('/editor')}>
              Go Back
            </Button>
            <div></div>
          </>
        )}
      </div>
      <div
        className="game-outer"
        style={{
          backgroundColor: page.format?.background ?? format.background,
        }}
      >
        <div className="game-inner" style={{ backgroundColor: page.format?.page ?? format.page }}>
          {page.content.map((block) => (
            <RenderBlock block={block} key={block.id} />
          ))}
        </div>
      </div>
      <div className="editor-rightbar">
        <Button onClick={() => setRightToggle((toggled) => !toggled)}>{rightToggle ? 'Close' : 'Open'}</Button>
        {rightToggle && (
          <Tabs>
            <TabPannel title="Project">
              <Accordion label="Base Settings">
                <div>
                  <Label width="110px">Game title</Label>
                  <TextField
                    onChange={(gameTitle) =>
                      dispatch(
                        changeGlobalSettings({
                          gameTitle,
                        }),
                      )
                    }
                    value={gameTitle}
                  />
                </div>
                <div>
                  <Label width="110px">Author name</Label>
                  <TextField
                    onChange={(author) =>
                      dispatch(
                        changeGlobalSettings({
                          author,
                        }),
                      )
                    }
                    value={author}
                  />
                </div>
                <div>
                  <Label width="110px">Export mode?</Label>
                  <Toggle
                    onChange={(expert) =>
                      dispatch(
                        changeGlobalSettings({
                          expert,
                        }),
                      )
                    }
                    checked={expert}
                  />
                </div>
                <div>
                  <Label width="110px">First page</Label>
                  <select
                    onChange={(e) =>
                      dispatch(
                        changeGlobalSettings({
                          firstPage: +e.target.value,
                        }),
                      )
                    }
                    value={firstPage}
                  >
                    {pages.map((page) => (
                      <option key={page.id} value={page.id}>
                        {page.name}
                      </option>
                    ))}
                  </select>
                </div>
              </Accordion>
              <Accordion label="Styling">
                <GlobalStyleEdition label="Background" property="background">
                  {(data) => <ColorPicker {...data} />}
                </GlobalStyleEdition>
                <GlobalStyleEdition label="Page" property="page">
                  {(data) => <ColorPicker {...data} />}
                </GlobalStyleEdition>
                <GlobalStyleEdition label="Text" property="textColor">
                  {(data) => <ColorPicker {...data} />}
                </GlobalStyleEdition>
                <GlobalStyleEdition label="Text font" property="textFont">
                  {(data) => (
                    <select value={data.value} onChange={(e) => data.onChange(e.target.value)}>
                      {allowedFonts.map((font) => (
                        <option key={font} value={font}>
                          {font}
                        </option>
                      ))}
                    </select>
                  )}
                </GlobalStyleEdition>
                <GlobalStyleEdition label="Button" property="btnColor">
                  {(data) => <ColorPicker {...data} />}
                </GlobalStyleEdition>
                <GlobalStyleEdition label="Button text" property="btnTextColor">
                  {(data) => <ColorPicker {...data} />}
                </GlobalStyleEdition>
                <GlobalStyleEdition label="Button font" property="btnFont">
                  {(data) => (
                    <select value={data.value} onChange={(e) => data.onChange(e.target.value)}>
                      {allowedFonts.map((font) => (
                        <option key={font} value={font}>
                          {font}
                        </option>
                      ))}
                    </select>
                  )}
                </GlobalStyleEdition>
              </Accordion>
              <Accordion label="Start script">
                <JsCodeEditor
                  value={startScript ?? ''}
                  onChange={(value) =>
                    dispatch(
                      changeGlobalSettings({
                        startScript: value,
                      }),
                    )
                  }
                />
              </Accordion>
            </TabPannel>
            <TabPannel title="Page">
              <Accordion label="Styling">
                <PageStyleEdition label="Background" page={page} property="background">
                  {(data) => <ColorPicker {...data} />}
                </PageStyleEdition>
                <PageStyleEdition label="Page" page={page} property="page">
                  {(data) => <ColorPicker {...data} />}
                </PageStyleEdition>
                <PageStyleEdition label="Text" page={page} property="textColor">
                  {(data) => <ColorPicker {...data} />}
                </PageStyleEdition>
                <PageStyleEdition label="Text font" page={page} property="textFont">
                  {(data) => (
                    <select value={data.value} onChange={(e) => data.onChange(e.target.value)}>
                      {allowedFonts.map((font) => (
                        <option key={font} value={font}>
                          {font}
                        </option>
                      ))}
                    </select>
                  )}
                </PageStyleEdition>
                <PageStyleEdition label="Button" page={page} property="btnColor">
                  {(data) => <ColorPicker {...data} />}
                </PageStyleEdition>
                <PageStyleEdition label="Button text" page={page} property="btnTextColor">
                  {(data) => <ColorPicker {...data} />}
                </PageStyleEdition>
                <PageStyleEdition label="Button text font" page={page} property="btnFont">
                  {(data) => (
                    <select value={data.value} onChange={(e) => data.onChange(e.target.value)}>
                      {allowedFonts.map((font) => (
                        <option key={font} value={font}>
                          {font}
                        </option>
                      ))}
                    </select>
                  )}
                </PageStyleEdition>
              </Accordion>
            </TabPannel>
            <TabPannel title="Element">Three</TabPannel>
          </Tabs>
        )}
      </div>
    </div>
  );
}

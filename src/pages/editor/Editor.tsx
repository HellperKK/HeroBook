import { useState } from 'react';
import Button from '../../components/inputs/button/Button';
import './editor.scss';
import { BaseDirectory, writeTextFile } from '@tauri-apps/plugin-fs';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ButtonGroup from '../../components/inputs/buttonGroup/buttonGroup';
import ColorPicker from '../../components/inputs/colorPicker/ColorPicker';
import TextArea from '../../components/inputs/textArea/TextArea';
import TextField from '../../components/inputs/textField/TextField';
import Toggle from '../../components/inputs/toggle/Toggle';
import Accordion from '../../components/surfaces/accordion/Accordion';
import TabPannel from '../../components/surfaces/tabs/TabPannel';
import Tabs from '../../components/surfaces/tabs/Tabs';
import Label from '../../components/texts/label/Label';
import {
  addPageFromChoice,
  changeBlockSettings,
  changeGlobalSettings,
  changePageSettings,
  deleteBlockAt,
} from '../../store/projectSlice';
import type { RootState } from '../../store/store';
import { freshId } from '../../utils/freshId';
import { allowedFonts } from '../../utils/game/allowedFonts';
import { projectsPath } from '../../utils/paths';
import RenderBlock from './blocks/RenderBlock';
import InsertBlockButton from './insertBlockButton/InsertBlockButton';
import JsCodeEditor from './jsCodeEditor/JsCodeEditor';
import BlockStyleEdition from './styleEdition/BlockStyleEdition';
import GlobalStyleEdition from './styleEdition/GlobalStyleEdition';
import PageStyleEdition from './styleEdition/PageStyleEdition';

export default function Editor() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const {
    pages,
    settings: { format, gameTitle, author, expert, firstPage, startScript, folderName },
  } = useSelector((state: RootState) => state.project);
  const [leftToggle, setLeftToggle] = useState(false);
  const [rightToggle, setRightToggle] = useState(true);
  const [blockIndex, setBlockIndex] = useState(-1);

  // biome-ignore lint/style/noNonNullAssertion: will allways work
  const page = pages.find((page) => page.id === +params.id!)!;

  const leftSize = leftToggle ? '400px' : '70px';
  const rightSize = rightToggle ? '400px' : '70px';
  const selectedBlock = blockIndex === -1 ? null : page.content[blockIndex];

  return (
    <div className="editor" style={{ gridTemplateColumns: `${leftSize} 1fr ${rightSize}` }}>
      <div className="editor-buttons">
        <ButtonGroup>
          <Button type="button" onClick={() => navigate('/editor')}>
            Go Back
          </Button>
          <Button
            onClick={async () => {
              console.log('save');
              await writeTextFile(
                `${projectsPath}/${folderName}/data.json`,
                JSON.stringify(
                  {
                    pages,
                    settings: { format, gameTitle, author, expert, firstPage, startScript, folderName },
                  },
                  null,
                  4,
                ),
                {
                  baseDir: BaseDirectory.Document,
                },
              );
            }}
          >
            Save
          </Button>
        </ButtonGroup>
      </div>
      <div className="editor-leftbar">
        <Button onClick={() => setLeftToggle((toggled) => !toggled)}>{leftToggle ? 'Close' : 'Open'}</Button>
        {/*leftToggle && (
          <>
            <div></div>
          </>
        )*/}
      </div>
      <div
        className="game-outer"
        style={{
          backgroundColor: page.format?.background ?? format.background,
        }}
      >
        <div className="game-inner" style={{ backgroundColor: page.format?.page ?? format.page }}>
          {page.content.map((block, index) => (
            <div className="block-pair" key={block.id}>
              <InsertBlockButton index={index} />
              <RenderBlock active={blockIndex === index} block={block} onClick={() => setBlockIndex(index)} />
            </div>
          ))}
          <InsertBlockButton index={page.content.length} />
        </div>
      </div>
      <div className="editor-rightbar">
        <Button onClick={() => setRightToggle((toggled) => !toggled)}>{rightToggle ? 'Close' : 'Open'}</Button>
        {rightToggle && (
          <Tabs>
            <TabPannel title="Project">
              <Accordion label="Settings">
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
              <Accordion label="Settings">
                <div>
                  <Label width="110px">Page title</Label>
                  <TextField
                    onChange={(name) =>
                      dispatch(
                        changePageSettings({
                          pageId: page.id,
                          page: { name },
                        }),
                      )
                    }
                    value={page.name}
                  />
                </div>
              </Accordion>
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
                <PageStyleEdition label="Button font" page={page} property="btnFont">
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
            <TabPannel title="Element">
              {selectedBlock && selectedBlock.type === 'text' && (
                <>
                  <Accordion label="Content">
                    <TextArea
                      value={selectedBlock.content}
                      onChange={(value) =>
                        dispatch(
                          changeBlockSettings({
                            pageId: page.id,
                            blockPosition: blockIndex,
                            settings: { content: value },
                          }),
                        )
                      }
                    />
                  </Accordion>
                  <Accordion label="Styling">
                    <BlockStyleEdition label="Text" page={page} blockPosition={blockIndex} property="textColor">
                      {(data) => <ColorPicker {...data} />}
                    </BlockStyleEdition>
                    <BlockStyleEdition label="Text font" page={page} blockPosition={blockIndex} property="textFont">
                      {(data) => (
                        <select value={data.value} onChange={(e) => data.onChange(e.target.value)}>
                          {allowedFonts.map((font) => (
                            <option key={font} value={font}>
                              {font}
                            </option>
                          ))}
                        </select>
                      )}
                    </BlockStyleEdition>
                  </Accordion>
                </>
              )}
              {selectedBlock && selectedBlock.type === 'choice' && (
                <>
                  <Accordion label="Content">
                    <Label width="110px">Text</Label>
                    <TextField
                      value={selectedBlock.text}
                      onChange={(value) =>
                        dispatch(
                          changeBlockSettings({
                            pageId: page.id,
                            blockPosition: blockIndex,
                            settings: { text: value },
                          }),
                        )
                      }
                    />
                    <Label width="110px">Next page</Label>
                    <select
                      value={selectedBlock.pageId}
                      onChange={(e) => {
                        const value = +e.target.value;
                        if (value === -1) {
                          const newId = freshId(pages);
                          dispatch(
                            addPageFromChoice({
                              pageId: page.id,
                              blockPosition: blockIndex,
                              newId,
                            }),
                          );
                          navigate(`/editor/page/${newId}`);
                          return;
                        }

                        dispatch(
                          changeBlockSettings({
                            pageId: page.id,
                            blockPosition: blockIndex,
                            settings: { pageId: value },
                          }),
                        );
                      }}
                    >
                      <option key={-1} value={-1}>
                        Create new page
                      </option>
                      {pages.map((page) => (
                        <option key={page.id} value={page.id}>
                          {page.name}
                        </option>
                      ))}
                    </select>
                  </Accordion>
                  <Accordion label="Scripts">
                    <Label width="110px">Condition</Label>
                    <JsCodeEditor
                      value={selectedBlock.contidion}
                      onChange={(value) =>
                        dispatch(
                          changeBlockSettings({
                            pageId: page.id,
                            blockPosition: blockIndex,
                            settings: { contidion: value },
                          }),
                        )
                      }
                    />
                    <Label width="110px">Action</Label>
                    <JsCodeEditor
                      value={selectedBlock.action}
                      onChange={(value) =>
                        dispatch(
                          changeBlockSettings({
                            pageId: page.id,
                            blockPosition: blockIndex,
                            settings: { action: value },
                          }),
                        )
                      }
                    />
                  </Accordion>
                  <Accordion label="Styling">
                    <BlockStyleEdition label="Button" page={page} blockPosition={blockIndex} property="btnColor">
                      {(data) => <ColorPicker {...data} />}
                    </BlockStyleEdition>
                    <BlockStyleEdition
                      label="Button text"
                      page={page}
                      blockPosition={blockIndex}
                      property="btnTextColor"
                    >
                      {(data) => <ColorPicker {...data} />}
                    </BlockStyleEdition>
                    <BlockStyleEdition label="Button font" page={page} blockPosition={blockIndex} property="btnFont">
                      {(data) => (
                        <select value={data.value} onChange={(e) => data.onChange(e.target.value)}>
                          {allowedFonts.map((font) => (
                            <option key={font} value={font}>
                              {font}
                            </option>
                          ))}
                        </select>
                      )}
                    </BlockStyleEdition>
                  </Accordion>
                </>
              )}
              {selectedBlock && (
                <Accordion label="Deletion">
                  <Button onClick={() => dispatch(deleteBlockAt({ blockPosition: blockIndex, pageId: page.id }))}>
                    Delete
                  </Button>
                </Accordion>
              )}
            </TabPannel>
          </Tabs>
        )}
      </div>
    </div>
  );
}

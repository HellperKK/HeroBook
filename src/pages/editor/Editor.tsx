import { useState } from "react";
import Button from "../../components/inputs/button/Button";
import "./editor.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ColorPicker from "../../components/inputs/colorPicker/ColorPicker";
import TextField from "../../components/inputs/textField/TextField";
import Toggle from "../../components/inputs/toggle/Toggle";
import Accordion from "../../components/surfaces/accordion/Accordion";
import TabPannel from "../../components/surfaces/tabs/TabPannel";
import Tabs from "../../components/surfaces/tabs/Tabs";
import Label from "../../components/texts/label/Label";
import {
	changeGlobalFormat,
	changeGlobalSettings,
	changePageFormat,
	clearPageFormat,
} from "../../store/projectSlice";
import type { RootState } from "../../store/store";
import { allowedFonts } from "../../utils/game/allowedFonts";
import RenderBlock from "./blocks/RenderBlock";
import JsCodeEditor from "./jsCodeEditor/JsCodeEditor";

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
	const pageFormat = { ...format, ...page.format };

	const leftSize = leftToggle ? "400px" : "70px";
	const rightSize = rightToggle ? "400px" : "70px";

	return (
		<div
			className="editor"
			style={{ gridTemplateColumns: `${leftSize} 1fr ${rightSize}` }}
		>
			<div className="editor-leftbar">
				<Button onClick={() => setLeftToggle((toggled) => !toggled)}>
					{leftToggle ? "Close" : "Open"}
				</Button>
				{leftToggle && (
					<>
						<Button type="button" onClick={() => navigate("/editor")}>
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
				<div
					className="game-inner"
					style={{ backgroundColor: page.format?.page ?? format.page }}
				>
					{page.content.map((block) => (
						<RenderBlock block={block} key={block.id} />
					))}
				</div>
			</div>
			<div className="editor-rightbar">
				<Button onClick={() => setRightToggle((toggled) => !toggled)}>
					{rightToggle ? "Close" : "Open"}
				</Button>
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
								<div>
									<Label width="110px">Background</Label>
									<ColorPicker
										onChange={(background) =>
											dispatch(
												changeGlobalFormat({
													background,
												}),
											)
										}
										value={format.background}
									/>
								</div>
								<div>
									<Label width="110px">Page</Label>
									<ColorPicker
										onChange={(page) =>
											dispatch(
												changeGlobalFormat({
													page,
												}),
											)
										}
										value={format.page}
									/>
								</div>
								<div>
									<Label width="110px">Text</Label>
									<ColorPicker
										onChange={(textColor) =>
											dispatch(
												changeGlobalFormat({
													textColor,
												}),
											)
										}
										value={format.btnTextColor}
									/>
								</div>
								<div>
									<Label width="110px">Text font</Label>
									<select
										value={format.textFont}
										onChange={(e) =>
											dispatch(changeGlobalFormat({ textFont: e.target.value }))
										}
									>
										{allowedFonts.map((font) => (
											<option key={font} value={font}>
												{font}
											</option>
										))}
									</select>
								</div>
								<div>
									<Label width="110px">Button</Label>
									<ColorPicker
										onChange={(btnColor) =>
											dispatch(
												changeGlobalFormat({
													btnColor,
												}),
											)
										}
										value={format.btnColor}
									/>
								</div>
								<div>
									<Label width="110px">Button text</Label>
									<ColorPicker
										onChange={(btnTextColor) =>
											dispatch(
												changeGlobalFormat({
													btnTextColor,
												}),
											)
										}
										value={format.btnTextColor}
									/>
								</div>
								<div>
									<Label width="110px">Button font</Label>
									<select
										value={format.btnFont}
										onChange={(e) =>
											dispatch(changeGlobalFormat({ btnFont: e.target.value }))
										}
									>
										{allowedFonts.map((font) => (
											<option key={font} value={font}>
												{font}
											</option>
										))}
									</select>
								</div>
							</Accordion>
							<Accordion label="Start script">
								<JsCodeEditor
									value={startScript ?? ""}
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
								<div>
									<Label width="110px">Background</Label>
									<ColorPicker
										onChange={(background) =>
											dispatch(
												changePageFormat({
													pageId: page.id,
													format: {
														background,
													},
												}),
											)
										}
										value={pageFormat.background}
									/>
									<Button
										disabled={!page.format.background}
										onClick={() =>
											dispatch(
												clearPageFormat({
													pageId: page.id,
													property: "background",
												}),
											)
										}
									>
										Reset
									</Button>
								</div>
								<div>
									<Label width="110px">Page</Label>
									<ColorPicker
										onChange={(pageColor) =>
											dispatch(
												changePageFormat({
													pageId: page.id,
													format: {
														page: pageColor,
													},
												}),
											)
										}
										value={pageFormat.page}
									/>
									<Button
										disabled={!page.format.page}
										onClick={() =>
											dispatch(
												clearPageFormat({
													pageId: page.id,
													property: "page",
												}),
											)
										}
									>
										Reset
									</Button>
								</div>
								<div>
									<Label width="110px">Text</Label>
									<ColorPicker
										onChange={(textColor) =>
											dispatch(
												changePageFormat({
													pageId: page.id,
													format: {
														textColor,
													},
												}),
											)
										}
										value={pageFormat.textColor}
									/>
									<Button
										disabled={!page.format.textColor}
										onClick={() =>
											dispatch(
												clearPageFormat({
													pageId: page.id,
													property: "textColor",
												}),
											)
										}
									>
										Reset
									</Button>
								</div>
								<div>
									<Label width="110px">Text font</Label>
									<select
										value={pageFormat.textFont}
										onChange={(e) =>
											dispatch(
												changePageFormat({
													pageId: page.id,
													format: {
														textFont: e.target.value,
													},
												}),
											)
										}
									>
										{allowedFonts.map((font) => (
											<option key={font} value={font}>
												{font}
											</option>
										))}
									</select>
									<Button
										disabled={!page.format.textFont}
										onClick={() =>
											dispatch(
												clearPageFormat({
													pageId: page.id,
													property: "textFont",
												}),
											)
										}
									>
										Reset
									</Button>
								</div>
								<div>
									<Label width="110px">Button</Label>
									<ColorPicker
										onChange={(btnColor) =>
											dispatch(
												changePageFormat({
													pageId: page.id,
													format: {
														btnColor,
													},
												}),
											)
										}
										value={pageFormat.btnColor}
									/>
									<Button
										disabled={!page.format.btnColor}
										onClick={() =>
											dispatch(
												clearPageFormat({
													pageId: page.id,
													property: "btnColor",
												}),
											)
										}
									>
										Reset
									</Button>
								</div>
								<div>
									<Label width="110px">Button text</Label>
									<ColorPicker
										onChange={(btnTextColor) =>
											dispatch(
												changePageFormat({
													pageId: page.id,
													format: {
														btnTextColor,
													},
												}),
											)
										}
										value={pageFormat.btnTextColor}
									/>
									<Button
										disabled={!page.format.btnTextColor}
										onClick={() =>
											dispatch(
												clearPageFormat({
													pageId: page.id,
													property: "btnTextColor",
												}),
											)
										}
									>
										Reset
									</Button>
								</div>
								<div>
									<Label width="110px">Button font</Label>
									<select
										value={pageFormat.btnFont}
										onChange={(e) =>
											dispatch(
												changePageFormat({
													pageId: page.id,
													format: {
														btnFont: e.target.value,
													},
												}),
											)
										}
									>
										{allowedFonts.map((font) => (
											<option key={font} value={font}>
												{font}
											</option>
										))}
									</select>
									<Button
										disabled={!page.format.btnFont}
										onClick={() =>
											dispatch(
												clearPageFormat({
													pageId: page.id,
													property: "btnFont",
												}),
											)
										}
									>
										Reset
									</Button>
								</div>
							</Accordion>
						</TabPannel>
						<TabPannel title="Element">Three</TabPannel>
					</Tabs>
				)}
			</div>
		</div>
	);
}

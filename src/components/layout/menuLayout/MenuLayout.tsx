import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	darkContrastTheme,
	darkTheme,
	lightContrastTheme,
	lightTheme,
} from "../../../utils/styles/colors";
import { fontDys, fontSans, fontSystem } from "../../../utils/styles/fonts";
import { mediumSize, smallSize } from "../../../utils/styles/sizes";
import type { Theme } from "../../../utils/styles/Theme";
import Button from "../../inputs/button/Button";
import ColorPicker from "../../inputs/colorPicker/ColorPicker";
import Range from "../../inputs/range/Range";
import Accordion from "../../surfaces/accordion/Accordion";
import Modal from "../../surfaces/modal/Modal";
import Label from "../../texts/label/Label";
import Text from "../../texts/text/Text";
import DropDownBar from "./DropDownBar";
import MenuButton from "./MenuButton";
import "./menuLayout.scss";
import { invoke } from "@tauri-apps/api/core";
import { Outlet, useNavigate } from "react-router-dom";
import { isDesktopApp } from "../../../utils/isDesktopApp";

type Props = {
	theme: Theme;
	updateTheme: (theme: Partial<Theme>) => void;
};

export default function MenuLayout({ theme, updateTheme }: Props) {
	const { t, i18n } = useTranslation();
	const navigate = useNavigate();

	const [stylingOpen, setStylingOpen] = useState(false);

	return (
		<div className="menu-layout">
			<div className="menu-dropdown">
				{
					<DropDownBar label={t("file")}>
						<MenuButton onClick={() => navigate("/new")}>
							New project
						</MenuButton>
						<MenuButton>Open project</MenuButton>
						<MenuButton onClick={() => navigate("/")}>Close project</MenuButton>
						<MenuButton
							onClick={async () => {
								if (await isDesktopApp()) {
									await invoke("quit", {});
								}
							}}
						>
							{t("quit")}
						</MenuButton>
					</DropDownBar>
				}
				<DropDownBar label={t("window")}>
					<MenuButton onClick={() => setStylingOpen(true)}>
						{t("settings")}
					</MenuButton>
				</DropDownBar>
			</div>
			<div className="menu-content">
				<Outlet />
			</div>

			{/* Styling modale */}
			<Modal
				title={t("settings")}
				open={stylingOpen}
				onClose={() => setStylingOpen(false)}
				className="styling-modal"
			>
				<div>
					<Text>{t("language")}</Text>
					<Button onClick={() => i18n.changeLanguage("en")}>English</Button>
					<Button onClick={() => i18n.changeLanguage("fr")}>Français</Button>
				</div>

				<div>
					<Text>{t("colors")}</Text>
					<Button onClick={() => updateTheme(lightTheme)}>
						{t("light theme")}
					</Button>
					<Button onClick={() => updateTheme(lightContrastTheme)}>
						{t("light contrast theme")}
					</Button>
					<Button onClick={() => updateTheme(darkTheme)}>
						{t("dark theme")}
					</Button>
					<Button onClick={() => updateTheme(darkContrastTheme)}>
						{t("dark contrast theme")}
					</Button>
					<Accordion label={t("more")}>
						<div>
							<Label width="100px">{t("Primary")}</Label>
							<ColorPicker
								value={theme.primary}
								onChange={(value) => updateTheme({ primary: value })}
							/>
						</div>
						<div>
							<Label width="100px">{t("Primary text")}</Label>
							<ColorPicker
								value={theme.textPrimary}
								onChange={(value) => updateTheme({ textPrimary: value })}
							/>
						</div>
						<div>
							<Label width="100px">{t("Surface")}</Label>
							<ColorPicker
								value={theme.surface}
								onChange={(value) => updateTheme({ surface: value })}
							/>
						</div>
						<div>
							<Label width="100px">{t("Surface text")}</Label>
							<ColorPicker
								value={theme.textSurface}
								onChange={(value) => updateTheme({ textSurface: value })}
							/>
						</div>
					</Accordion>
				</div>

				<div>
					<Text>{t("text size")}</Text>
					<Button onClick={() => updateTheme(smallSize)}>
						{t("small text")}
					</Button>
					<Button onClick={() => updateTheme(mediumSize)}>
						{t("medium text")}
					</Button>
				</div>

				<div>
					<Text>{t("font")}</Text>
					<Button onClick={() => updateTheme(fontSystem)}>System</Button>
					<Button onClick={() => updateTheme(fontSans)}>Sans</Button>
					<Button onClick={() => updateTheme(fontDys)}>Dyslexic</Button>
				</div>

				<div>
					<Text>{t("click delay")}</Text>
					<Range
						onChange={(value) => updateTheme({ clickDelay: value })}
						value={theme.clickDelay}
						min={0}
						max={1000}
						step={100}
					/>
					<Label>{theme.clickDelay.toString()}</Label>
				</div>
			</Modal>
		</div>
	);
}

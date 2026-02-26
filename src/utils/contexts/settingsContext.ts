import { createContext } from "react";
import { defaultTheme } from "../styles/default";

const SettingsContext = createContext(defaultTheme);

export default SettingsContext;
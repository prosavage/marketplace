import {atom} from "recoil";
import ITheme from "../styles/theme/ITheme";
import LightTheme from "../styles/theme/LightTheme";

export const themeState = atom<ITheme>({
    key: "THEME",
    default: LightTheme
})
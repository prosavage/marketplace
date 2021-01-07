import { atom } from "recoil";
import DarkTheme from "../theme/DarkTheme";
import ITheme from "../theme/ITheme";

export const themeState = atom<ITheme>({
    key: "THEME",
    default: DarkTheme
})
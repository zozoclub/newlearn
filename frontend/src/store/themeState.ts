import { atom } from "recoil";

export const themeState = atom<"light" | "dark">({
  key: "themeState",
  default: (() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme as "light" | "dark";
    }
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  })(),
});

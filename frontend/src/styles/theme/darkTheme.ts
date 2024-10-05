import { Theme } from "types/theme";

export const darkTheme: Theme = {
  mode: "dark",
  size: {
    mobile: "767px",
    desktop: "768px",
  },
  colors: {
    background: "#000000",
    cardBackground: "#333344",
    cardBackground01: "#1a1925bd",
    newsItemBackground: "#0000003f",
    newsItemBackgroundPress: "#000000aa",
    primary: "#0268ed",
    primaryPress: "#0057b6",
    danger: "#e9404f",
    dangerPress: "#ff6573",
    cancel: "#1a1925",
    cancelPress: "#282638",
    text: "#ffffff",
    text01: "#fbfbfb",
    text02: "#dfdfdf",
    text03: "#c1c1c1",
    text04: "#a5a5a5",
    readonly: "#333333",
    placeholder: "#8b8b8b",
    highliting: "#78AFF0",
  },
  shadows: {
    xsmall: "0.125rem 0.125rem 0.125rem #000000BD",
    small: "0.25rem 0.25rem 0.25rem #000000BD",
    medium: "0.5rem 0.5rem 0.25rem #000000BD",
  },
  opacities: {
    background: 100,
  },
};

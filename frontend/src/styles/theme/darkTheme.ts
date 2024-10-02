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
    primary: "#0099ff",
    primaryPress: "#62b7ff",
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
  },
  shadows: {
    medium: "0.5rem 0.5rem 0.25rem #000000BD",
  },
  opacities: {
    background: 100,
  },
};

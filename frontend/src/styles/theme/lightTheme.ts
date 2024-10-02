import { Theme } from "types/theme";

export const lightTheme: Theme = {
  mode: "light",
  size: {
    mobile: "767px",
    desktop: "768px",
  },
  colors: {
    background: "#ffffff",
    cardBackground: "#ffffff",
    cardBackground01: "#ffffffbd",
    primary: "#0268ed",
    primaryPress: "#0057b6",
    danger: "#df1d1d",
    dangerPress: "#bc1a1a",
    cancel: "#eeeeee",
    cancelPress: "#a5a5a5",
    text: "#000000",
    text01: "#242424",
    text02: "#555555",
    text03: "#6f6f6f",
    text04: "#8b8b8b",
    readonly: "#ececec",
    placeholder: "#c1c1c1",
  },
  shadows: {
    medium: "0.5rem 0.5rem 0.25rem #0000007F",
  },
  opacities: {
    background: 0,
  },
};

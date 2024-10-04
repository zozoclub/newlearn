export type Theme = {
  mode: "dark" | "light";
  size: {
    mobile: string;
    desktop: string;
  };
  colors: {
    background: string;
    cardBackground: string;
    cardBackground01: string;
    newsItemBackground: string;
    newsItemBackgroundPress: string;
    primary: string;
    primaryPress: string;
    danger: string;
    dangerPress: string;
    cancel: string;
    cancelPress: string;
    text: string;
    text01: string;
    text02: string;
    text03: string;
    text04: string;
    readonly: string;
    placeholder: string;
    highliting: string;
  };
  shadows: {
    small: string;
    medium: string;
  };
  opacities: {
    background: number;
  };
};

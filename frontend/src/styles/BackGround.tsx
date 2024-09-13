import { Theme } from "types/theme";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { themeState } from "@store/themeState";
import { darkTheme } from "./theme/darkTheme";
import { lightTheme } from "./theme/lightTheme";

const Container = styled.div`
  position: absolute;
  z-index: -1;
`;
const LightBackground = styled.img.attrs({
  src: "src/assets/images/background-light.png",
  alt: "",
})`
  position: fixed;
  z-index: 1;
  width: 1925px;
`;

const DarkBackground = styled.img.attrs({
  src: "src/assets/images/background-dark.png",
  alt: "",
})<{ theme: Theme }>`
  position: fixed;
  z-index: 2;
  width: 1925px;
  transition: opacity 0.5s;
  opacity: ${(props) => props.theme.opacities.background};
`;

const Background = () => {
  const theme = useRecoilValue(themeState) === "dark" ? darkTheme : lightTheme;

  return (
    <Container>
      <LightBackground theme={theme} />
      <DarkBackground theme={theme} />
    </Container>
  );
};

export default Background;

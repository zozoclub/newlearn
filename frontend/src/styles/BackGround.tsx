import styled from "styled-components";
import { useMediaQuery } from "react-responsive";

const Background = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <Container $ismobile={isMobile}>
      {!isMobile && <LightBackgroundImg />}
      {!isMobile && <DarkBackgroundImg />}
      <BackgroundDiv $ismobile={isMobile} />
    </Container>
  );
};

const Container = styled.div<{ $ismobile: boolean }>`
  position: absolute;
  z-index: -1;
  width: calc(100vw - 0.375rem);
  height: 100vh;
  background-color: ${(props) =>
    props.$ismobile ? props.theme.colors.cardBackground : "transparent"};
`;

const LightBackgroundImg = styled.img.attrs({
  src: "/src/assets/images/background-light.webp",
  alt: "",
})`
  position: fixed;
  z-index: 1;
  width: calc(100vw - 0.375rem);
  height: 100vh;
  transition: opacity 0.5s;
`;

const DarkBackgroundImg = styled.img.attrs({
  src: "/src/assets/images/background-dark.webp",
  alt: "",
})`
  position: fixed;
  z-index: 2;
  width: calc(100vw - 0.375rem);
  height: 100vh;
  transition: opacity 0.5s;
  opacity: ${(props) => props.theme.opacities.background};
`;

const BackgroundDiv = styled.div<{ $ismobile: boolean }>`
  position: fixed;
  z-index: 1;
  width: calc(100vw - 0.375rem);
  height: 100vh;
  transition: opacity 0.5s;
  opacity: ${(props) => props.theme.opacities.background};
  background-color: ${(props) =>
    props.$ismobile
      ? props.theme.colors.cardBackground
      : props.theme.colors.background};
`;

export default Background;

import styled from "styled-components";

const Background = () => {
  return (
    <Container>
      <LightBackgroundImg />
      <DarkBackgroundImg />
      <BackgroundDiv />
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  z-index: -1;
`;
const LightBackgroundImg = styled.img.attrs({
  src: "/src/assets/images/background-light.png",
  alt: "",
})`
  position: fixed;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  transition: opacity 0.5s;
  @media (max-width: ${(props) => props.theme.size.mobile}) {
    opacity: 0;
  }
`;

const DarkBackgroundImg = styled.img.attrs({
  src: "/src/assets/images/background-dark.png",
  alt: "",
})`
  position: fixed;
  z-index: 2;
  width: 100vw;
  height: 100vh;
  transition: opacity 0.5s;
  opacity: ${(props) => props.theme.opacities.background};
  @media (max-width: ${(props) => props.theme.size.mobile}) {
    opacity: 0;
  }
`;

const BackgroundDiv = styled.div`
  position: fixed;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  transition: opacity 0.5s;
  opacity: ${(props) => props.theme.opacities.background};
  background-color: ${(props) => props.theme.colors.background};
`;

export default Background;

import styled from "styled-components";

const LoadingBar = () => {
  return <Container></Container>;
};

export default LoadingBar;

const Container = styled.div`
  position: absolute;
  height: 0.5rem;
  border-radius: 0.75rem;
  animation: bgmove 1s infinite;
  animation-timing-function: ease;

  @keyframes bgmove {
    0% {
      width: 0;
      background-color: ${(props) => props.theme.colors.placeholder};
    }
    100% {
      width: 100%;
      background-color: ${(props) => props.theme.colors.placeholder};
    }
  }
`;

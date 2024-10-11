import { usePageTransition } from "@hooks/usePageTransition";
import locationState from "@store/locationState";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

const NotFoundPage = () => {
  const setCurrentLocation = useSetRecoilState(locationState);
  const transitionTo = usePageTransition();

  useEffect(() => {
    setCurrentLocation("notFound");
    return () => {
      setCurrentLocation("");
    };
  }, [setCurrentLocation]);

  return (
    <Container>
      <h1>Page Not Found!</h1>
      <div onClick={() => transitionTo("/")}>메인으로 돌아가기</div>
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  h1 {
    margin-bottom: 1.5rem;
    font-size: 3rem;
    font-weight: 700;
  }
  a {
    color: ${(props) => props.theme.colors.text02};
    font-size: 1.5rem;
    text-decoration: none;
  }
`;

export default NotFoundPage;

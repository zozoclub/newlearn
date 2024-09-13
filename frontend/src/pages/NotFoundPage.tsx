import locationState from "@store/locationState";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useResetRecoilState } from "recoil";
import styled from "styled-components";

const NotFoundPage = () => {
  const resetCurrentLocation = useResetRecoilState(locationState);

  useEffect(() => {
    resetCurrentLocation();
  }, [resetCurrentLocation]);

  return (
    <Container>
      <div>Page Not Found!</div>
      <Link to="/">메인으로 돌아가기</Link>
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  div {
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

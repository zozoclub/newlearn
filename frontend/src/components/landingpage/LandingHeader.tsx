import { usePageTransition } from "@hooks/usePageTransition";
import styled from "styled-components";

const LandingHeader = () => {
  const transitionTo = usePageTransition();

  return (
    <Container>
      <LoginButton onClick={() => transitionTo("login")}>로그인</LoginButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  position: fixed;
  z-index: 1;
  top: 3.25rem;
  right: 5%;
  background-color: transparent;
`;

const LoginButton = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  color: white;
  background-color: ${(props) => props.theme.colors.primary};
  box-shadow: 0.25rem 0.25rem 0.25rem #000000aa;
  border-radius: 0.75rem;
  transition: background-color 0.5s;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }
`;

export default LandingHeader;

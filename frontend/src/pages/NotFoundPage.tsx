import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const NotFoundPage = () => {
  return <Container>404 Error</Container>;
};

export default NotFoundPage;

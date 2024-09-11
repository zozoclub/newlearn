import styled from "styled-components";

const Container = styled.div`
  background-color: ${(props) => props.theme.colors.cardBackground};
  border-radius: 0.5rem;
  padding: 1rem;
  position: fixed;
  left: 50%;
  transform: translate(-50%, 0);
  bottom: 1.5rem;
`;

const Navbar = () => {
  return <Container>안녕하세용 내브바에용</Container>;
};

export default Navbar;

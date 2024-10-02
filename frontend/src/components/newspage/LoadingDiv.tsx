import styled from "styled-components";

const LoadingDiv: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Container>{children}</Container>;
};

export default LoadingDiv;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 0.5rem;
  margin: 0.45rem;
  background-color: ${(props) => props.theme.colors.readonly};
  border-radius: 0.75rem;
  overflow: hidden;
`;

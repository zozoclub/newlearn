import styled from "styled-components";

const Container = styled.div`
  width: 200px;
  margin: 10px;
  padding: 10px;
  background-color: ${(props) => props.theme.colors.cardBackground + "BF"};
  backdrop-filter: blur(4px);
  border-radius: 12px;
  box-shadow: 0.5rem 0.5rem 0.25rem ${(props) => props.theme.colors.shadow};
  transition: box-shadow 0.5s;
`;

const Widget: React.FC<{ variety: string }> = ({ variety }) => {
  switch (variety) {
    case "profile":
      return <Container>프로필임</Container>;
    case "chart":
      return <Container>chart임</Container>;
    case "ranking":
      return <Container>랭킹임</Container>;
    case "goal":
      return <Container>목표임</Container>;
  }
};

export default Widget;

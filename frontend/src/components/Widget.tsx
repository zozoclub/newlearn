import styled from "styled-components";

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

const Container = styled.div`
  width: 200px;
  margin: 10px;
  padding: 10px;
  background-color: ${(props) => props.theme.colors.cardBackground + "BF"};
  border-radius: 12px;
  transition: box-shadow 0.5s;
  backdrop-filter: blur(4px);
  box-shadow: 0.5rem 0.5rem 0.25rem ${(props) => props.theme.colors.shadow};
`;

export default Widget;

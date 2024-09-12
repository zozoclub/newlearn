// import Button from "@components/Button";
// import { useTheme } from "@context/ThemeContext";

import styled from "styled-components";

const Container = styled.div`
  display: flex;
`;

const NewsContainer = styled.div``;

const WidgetContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Widget = styled.div`
  background-color: ${(props) => props.theme.colors.cardBackground + "BF"};
  backdrop-filter: blur(4px);
  border-radius: 12px;
`;

function MainPage() {
  // const { toggleTheme } = useTheme();

  return (
    <Container>
      <NewsContainer></NewsContainer>
      <WidgetContainer>
        <Widget>123</Widget>
        <Widget>123</Widget>
        <Widget>123</Widget>
        <Widget>123</Widget>
      </WidgetContainer>
      {/* <Button
        varient="primary"
        size="medium"
        onClick={() => console.log("Clicked!")}
      >
        안녕하세요
      </Button>
      <Button varient="cancel" size="medium" onClick={toggleTheme}>
        테마 전환
      </Button> */}
    </Container>
  );
}

export default MainPage;

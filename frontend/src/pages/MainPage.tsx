import { PWAInstallPrompt } from "@components/PWAInstallPrompt";
import Clock from "@components/mainpage/Clock";
import DailyNews from "@components/mainpage/DailyNews";
import Widget from "@components/mainpage/Widget";
// import NewsSearch from "@components/newspage/NewsSearch";
import styled from "styled-components";

const MainPage = () => {
  const widgetList = [
    { variety: "goal" },
    { variety: "chart" },
    { variety: "topRanking" },
    { variety: "ranking" },
  ];

  return (
    <Container>
      <NewsContainer>
        {/* <Header> */}
        <Clock />
        {/* <News>
            <NewsSearch />
          </News> */}
        {/* </Header> */}
        <DailyNews />
      </NewsContainer>
      <WidgetContainer>
        {widgetList.map((widget, index) => (
          <Widget key={index} variety={widget.variety} />
        ))}
      </WidgetContainer>
      <PWAInstallPrompt />
    </Container>
  );
};

export default MainPage;

const Container = styled.div`
  display: flex;
  position: relative;
  height: 35rem;
  padding: 5rem 0;
`;

// const Header = styled.div`
//   display: flex;
//   align-items: center;
//   margin: 0 2rem;
//   gap: 2rem;
// `;

// const News = styled.div`
//   width: 800px;
// `;

const NewsContainer = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
`;

const WidgetContainer = styled.div`
  display: grid;
  position: absolute;
  z-index: 1;
  right: 0;
  grid-template-columns: calc(50% - 1rem) calc(50% - 1rem);
  grid-gap: 2rem;
  width: 35rem;
`;

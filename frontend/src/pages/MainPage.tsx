import { PWAInstallPrompt } from "@components/PWAInstallPrompt";
import Clock from "@components/mainpage/Clock";
import DailyNews from "@components/mainpage/DailyNews";
import Widget from "@components/mainpage/Widget";
import locationState from "@store/locationState";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useSetRecoilState } from "recoil";
// import NewsSearch from "@components/newspage/NewsSearch";
import styled from "styled-components";
import RestudyQuiz from "@components/RestudyQuiz";

const MainPage = () => {
  const widgetList = [
    { variety: "goal" },
    { variety: "chart" },
    { variety: "topRanking" },
    { variety: "ranking" },
  ];
  const setCurrentLocationData = useSetRecoilState(locationState);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useEffect(() => {
    setCurrentLocationData("main");
    return () => {
      setCurrentLocationData("");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const MobileRender = () => {
    return (
      <Container>
        <NewsContainer>
          <DailyNews />
        </NewsContainer>
        <RestudyQuiz />
        <PWAInstallPrompt />
      </Container>
    );
  };

  const DesktopRender = () => {
    return (
      <Container>
        <div style={{ paddingLeft: "1rem", paddingTop: "1rem" }}>
          <Clock />
        </div>
        <DailyNews />
        <WidgetContainer>
          {widgetList.map((widget, index) => (
            <Widget key={index} variety={widget.variety} />
          ))}
        </WidgetContainer>
        <RestudyQuiz />
        <PWAInstallPrompt />
      </Container>
    );
  };

  if (isMobile) {
    return <MobileRender />;
  } else {
    return <DesktopRender />;
  }
};

export default MainPage;

const Container = styled.div`
  display: flex;
  position: relative;
  height: 35rem;
  padding: 0;
  @media screen and (max-width: 767px) {
  }
`;

const NewsContainer = styled.div``;

const WidgetContainer = styled.div`
  display: grid;
  position: absolute;
  z-index: 1;
  top: 1rem;
  right: 0;
  grid-template-columns: calc(50% - 1rem) calc(50% - 1rem);
  grid-gap: 2rem;
  width: 40rem;
`;

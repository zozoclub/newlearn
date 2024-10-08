import { PWAInstallPrompt } from "@components/PWAInstallPrompt";
import Clock from "@components/mainpage/Clock";
import DailyNews from "@components/mainpage/DailyNews";
import Widget from "@components/mainpage/Widget";
import locationState from "@store/locationState";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import RestudyQuiz from "@components/RestudyQuiz";
import MainMobilePage from "./mobile/MainMobilePage";

const MainPage = () => {
  const widgetList = [
    { variety: "goal" },
    { variety: "chart" },
    { variety: "ranking" },
  ];
  const setCurrentLocationData = useSetRecoilState(locationState);
  const isTablet = useMediaQuery({ query: "(max-width: 1279px" });
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useEffect(() => {
    setCurrentLocationData("main");
    return () => {
      setCurrentLocationData("");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const TabletRender = () => {
    return (
      <Container>
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: "-2.5rem",
              fontSize: "1.75rem",
              marginBottom: "1rem",
            }}
          >
            오늘의 추천 뉴스
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <DailyNews />
          </div>
        </div>
        <Widget variety="goal" />
        <Widget variety="ranking" />
        <Widget variety="chart" />
      </Container>
    );
  };

  const DesktopRender = () => {
    return (
      <Container>
        <NewsContainer>
          <Clock />
          <DailyNews />
        </NewsContainer>
        <WidgetContainer>
          {widgetList.map((widget, index) => (
            <Widget key={index} variety={widget.variety} />
          ))}
        </WidgetContainer>
      </Container>
    );
  };

  return (
    <Container>
      {isMobile ? (
        <MainMobilePage />
      ) : isTablet ? (
        <TabletRender />
      ) : (
        <DesktopRender />
      )}
      <RestudyQuiz />
      <PWAInstallPrompt />
    </Container>
  );
};

export default MainPage;

const Container = styled.div`
  display: flex;
  @media screen and (min-width: 1280px) {
    justify-content: space-between;
    position: absolute;
    left: 50%;
    top: 55%;
    transform: translate(-50%, -50%);
    width: 90vw;
    padding: 0 5vw;
    position: absolute;
  }
  @media screen and (min-width: 768px) and (max-width: 1279px) {
    display: grid;
    grid-template-columns: calc(66% - 0.5rem) calc(34% - 0.5rem);
    grid-gap: 1rem;
    align-content: center;
    width: 80vw;
    min-height: 80vh;
    margin: 0 auto;
  }
  @media screen and (max-width: 767px) {
    flex-direction: column;
    gap: 0.25rem;
  }
`;

const NewsContainer = styled.div`
  @media screen and (min-width: 1280px) {
    width: 55vw;
    aspect-ratio: 1.6;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
    gap: 2rem;
  }
`;

const WidgetContainer = styled.div`
  grid-gap: 1rem;
  @media screen and (min-width: 1280px) {
    display: grid;
    align-content: flex-start;
    grid-template-columns: calc(50% - 0.25rem) calc(50% - 0.25rem);
    padding-top: 1.5rem;
    width: 32.5%;
    min-width: 30rem;
  }
`;

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
        <NewsContainer>
          <div className="desc">오늘의 추천 뉴스</div>
          <DailyNews />
        </NewsContainer>
        <WidgetContainer>
          <Widget variety="goal" />
          <Widget variety="topRanking" />
        </WidgetContainer>
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
    width: 90%;
    padding: 0;
  }
  @media screen and (min-width: 768px) and (max-width: 1279px) {
    gap: 5%;
  }
  @media screen and (max-width: 767px) {
    flex-direction: column;
    gap: 0.25rem;
  }
`;

const NewsContainer = styled.div`
  @media screen and (min-width: 1280px) {
    width: 57.5%;
    aspect-ratio: 1.6;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
    gap: 5rem;
  }
  @media screen and (min-width: 768px) and (max-width: 1279px) {
    width: 50%;
    margin: auto;
    .desc {
      font-size: 2rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }
  }
`;

const WidgetContainer = styled.div`
  @media screen and (min-width: 1279px) {
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 0.5rem));
    grid-template-rows: repeat() (2, calc(50% - 0.5rem));
    grid-gap: 1rem;
    width: 40%;
  }
  @media screen and (min-width: 768px) and (max-width: 1279px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: auto;
    width: 30%;
  }
`;

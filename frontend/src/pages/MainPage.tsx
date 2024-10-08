import { PWAInstallPrompt } from "@components/PWAInstallPrompt";
import Clock from "@components/mainpage/Clock";
import DailyNews from "@components/mainpage/DailyNews";
import Widget from "@components/mainpage/Widget";
import locationState from "@store/locationState";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import RestudyQuiz from "@components/RestudyQuiz";
import MainMobilePage from "./mobile/MainMobilePage";
import { tutorialTipState } from "@store/tutorialState";
import { useResetRecoilState, useSetRecoilState } from "recoil";

const MainPage = () => {
  // 페이지마다 튜토리얼 추가해주시면 됩니다.
  const setTutorialTip = useSetRecoilState(tutorialTipState);
  const resetTutorialTip = useResetRecoilState(tutorialTipState);
  const startTutorial = () => {
    setTutorialTip({
      steps: [
        { selector: "#step1", content: "한글/영어 토글 버튼입니다." },
        {
          selector: "#step2",
          content: "오늘의 Top 10 뉴스입니다.",
        },
        {
          selector: "#step3",
          content: "학습 현황입니다. 최초에는 설정이 필요합니다.",
        },
        {
          selector: "#step4",
          content: "사용자가 읽은 뉴스의 카테고리를 차트로 볼 수 있습니다.",
        },
        {
          selector: "#step5",
          content: "포인트, 읽은 뉴스 수의 랭킹을 확인할 수 있습니다.",
        },
      ],
      isActive: true,
      onComplete: () => {
        console.log("튜토리얼 완료!");
        resetTutorialTip();
      },
    });
  };
  useEffect(() => {
    startTutorial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

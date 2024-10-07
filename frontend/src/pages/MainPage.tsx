import { PWAInstallPrompt } from "@components/PWAInstallPrompt";
import Clock from "@components/mainpage/Clock";
import DailyNews from "@components/mainpage/DailyNews";
import Widget from "@components/mainpage/Widget";
import locationState from "@store/locationState";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useRecoilValue, useSetRecoilState } from "recoil";
// import NewsSearch from "@components/newspage/NewsSearch";
import styled from "styled-components";
import RestudyQuiz from "@components/RestudyQuiz";
import FullLogo from "@components/common/FullLogo";
import newsSearchIcon from "@assets/icons/searchIcon.svg";
import userInfoState from "@store/userInfoState";

const MainPage = () => {
  const widgetList = [
    { variety: "goal" },
    { variety: "chart" },
    { variety: "topRanking" },
    { variety: "ranking" },
  ];
  const setCurrentLocationData = useSetRecoilState(locationState);
  const userInfoData = useRecoilValue(userInfoState);
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
        <MobileMainHeader>
          <FullLogo height={75} width={200} />
          <img height={30} src={newsSearchIcon} />
        </MobileMainHeader>
        <RecommandNewsContainer>
          <div style={{ fontSize: "1.5rem" }}>
            {userInfoData.nickname} 님의 추천 뉴스
          </div>
          <DailyNews />
        </RecommandNewsContainer>
        <RestudyQuiz />
        <PWAInstallPrompt />
      </Container>
    );
  };

  const DesktopRender = () => {
    return (
      <Container>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5rem",
            paddingLeft: "1rem",
            paddingTop: "1rem",
          }}
        >
          <Clock />
          <DailyNews />
        </div>
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
  padding: 0;
  @media screen and (max-width: 767px) {
    flex-direction: column;
  }
`;

const MobileMainHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 75px;
  padding: 0 1.5rem 0 0;
`;

const RecommandNewsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
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

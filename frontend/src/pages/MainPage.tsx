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
import TopRanking from "@components/mainpage/TopRanking";
import RankingKindSelect from "@components/mainpage/RankingKindSelect";
import DarkModeButton from "@components/common/DarkModeButton";

const MainPage = () => {
  const widgetList = [
    { variety: "goal" },
    { variety: "chart" },
    { variety: "ranking" },
  ];
  const setCurrentLocationData = useSetRecoilState(locationState);
  const userInfoData = useRecoilValue(userInfoState);
  const isTablet = useMediaQuery({ query: "(max-width: 1279px" });
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
          <FullLogo height={60} width={200} />
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ marginBottom: "0.25rem", transform: "scale(0.8)" }}>
              <DarkModeButton />
            </div>
            <img height={30} src={newsSearchIcon} />
          </div>
        </MobileMainHeader>
        <RecommandNewsContainer>
          <div
            style={{
              padding: "0 1rem",
              fontSize: "1.5rem",
              marginBottom: "1rem",
            }}
          >
            {userInfoData.nickname} 님의 추천 뉴스
          </div>
          <DailyNews />
        </RecommandNewsContainer>
        <RankingContainer>
          <RankingKindSelect />
          <TopRanking />
        </RankingContainer>
      </Container>
    );
  };

  const TabletRender = () => {
    return (
      <Container>
        <NewsContainer>
          <div className="desc">오늘의 추천 뉴스</div>
          <DailyNews />
        </NewsContainer>
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
        <RestudyQuiz />
        <PWAInstallPrompt />
      </Container>
    );
  };

  if (isMobile) {
    return <MobileRender />;
  } else if (isTablet) {
    return <TabletRender />;
  } else {
    return <DesktopRender />;
  }
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
    gap: 2.5%;
  }
  @media screen and (max-width: 767px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const NewsContainer = styled.div`
  @media screen and (min-width: 1280px) {
    width: 57.5%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
    gap: 5rem;
  }
  @media screen and (min-width: 768px) and (max-width: 1279px) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, calc(-50% + 75px));
    height: calc(100vh - 150px);
    overflow: hidden;
    .desc {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
  }
`;

const MobileMainHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 1.5rem 0 0;
  background-color: ${(props) => props.theme.colors.cardBackground};
`;

const RecommandNewsContainer = styled.div`
  background-color: ${(props) => props.theme.colors.cardBackground};
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 2.5%;
  @media screen and (max-width: 1279px) {
  }
`;

const RankingContainer = styled.div`
  height: 20rem;
  padding: 1rem 2rem 2rem;
  background-color: ${(props) => props.theme.colors.cardBackground};
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
    width: 30%;
  }
`;

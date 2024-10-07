import { PWAInstallPrompt } from "@components/PWAInstallPrompt";
import Clock from "@components/mainpage/Clock";
import DailyNews from "@components/mainpage/DailyNews";
import Widget from "@components/mainpage/Widget";
import locationState from "@store/locationState";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useRecoilValue, useSetRecoilState } from "recoil";
// import NewsSearch from "@components/newspage/NewsSearch";
import styled, { useTheme } from "styled-components";
import RestudyQuiz from "@components/RestudyQuiz";
import userInfoState from "@store/userInfoState";
import TopRanking from "@components/mainpage/TopRanking";
import RankingKindSelect from "@components/mainpage/RankingKindSelect";
import MobileLogoHeader from "@components/common/MobileLogoHeader";
import { useQuery } from "@tanstack/react-query";
import { NewsType } from "types/newsType";
import { getHybridNews } from "@services/newsService";
import languageState from "@store/languageState";
import lightThumbnailImage from "@assets/images/lightThumbnail.png";
import darkThumbnailImage from "@assets/images/darkThumbnail.png";

const MainPage = () => {
  const widgetList = [
    { variety: "goal" },
    { variety: "chart" },
    { variety: "ranking" },
  ];
  const setCurrentLocationData = useSetRecoilState(locationState);
  const userInfoData = useRecoilValue(userInfoState);
  const languageData = useRecoilValue(languageState);
  const isTablet = useMediaQuery({ query: "(max-width: 1279px" });
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { isLoading, data } = useQuery<NewsType[]>({
    queryKey: ["getHybridNews"],
    queryFn: getHybridNews,
    staleTime: 5 * 60 * 1000,
  });
  const Theme = useTheme();

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
        <MobileLogoHeader />
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
        <RecommandNewsContainer>
          {isLoading ? (
            <div>로딩둥</div>
          ) : (
            <div>
              {data?.map((news) => (
                <div
                  style={{
                    display: "flex",
                    position: "relative",
                    padding: "1.25rem",
                    borderBottom: "1px solid #0000004f",
                  }}
                >
                  {news.thumbnailImageUrl ? (
                    <img
                      style={{ width: "30%", aspectRatio: 1.6 }}
                      src={news.thumbnailImageUrl}
                    />
                  ) : (
                    <>
                      <div style={{ minWidth: "30%", aspectRatio: 1.6 }}></div>
                      <img
                        style={{
                          position: "absolute",
                          zIndex: 1,
                          width: "calc(30% - 0.75rem)",
                          aspectRatio: 1.6,
                        }}
                        src={lightThumbnailImage}
                      />
                      <img
                        style={{
                          position: "absolute",
                          zIndex: 2,
                          width: "calc(30% - 0.75rem)",
                          aspectRatio: 1.6,
                          opacity: Theme.mode === "dark" ? 1 : 0,
                          transition: "opacity 0.3s",
                        }}
                        src={darkThumbnailImage}
                      />
                    </>
                  )}

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "0 1rem",
                      fontSize: "1.25rem",
                    }}
                  >
                    <div>
                      {languageData === "en" ? news.titleEn : news.titleKr}
                    </div>
                    <div
                      style={{ display: "flex", gap: "0.5rem", opacity: 0.8 }}
                    >
                      {/* <div>{news.press}</div> */}
                      <div>{news.category}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </RecommandNewsContainer>
        <RankingContainer>
          <RankingKindSelect />
          <TopRanking />
        </RankingContainer>
        <RestudyQuiz />
        <PWAInstallPrompt />
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
        <WidgetContainer>
          <Widget variety="goal" />
          <Widget variety="topRanking" />
        </WidgetContainer>
        <RestudyQuiz />
        <PWAInstallPrompt />
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
    gap: 5%;
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
    width: 50%;
    margin: auto;
    .desc {
      font-size: 2rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }
  }
`;

const RecommandNewsContainer = styled.div`
  background-color: ${(props) => props.theme.colors.cardBackground};
  padding: 1rem 0 0;
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
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: auto;
    width: 30%;
  }
`;

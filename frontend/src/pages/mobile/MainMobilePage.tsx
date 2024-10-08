import { getHybridNews } from "@services/newsService";
import languageState from "@store/languageState";
import userInfoState from "@store/userInfoState";
import { useQuery } from "@tanstack/react-query";
import { NewsType } from "types/newsType";
import { useRecoilValue } from "recoil";
import styled, { useTheme } from "styled-components";
import MobileLogoHeader from "@components/common/MobileLogoHeader";
import DailyNews from "@components/mainpage/DailyNews";
import Spinner from "@components/Spinner";
import LoadingDiv from "@components/common/LoadingDiv";
import LoadingBar from "@components/common/LoadingBar";
import lightThumbnailImage from "@assets/images/lightThumbnail.png";
import darkThumbnailImage from "@assets/images/darkThumbnail.png";
import RankingKindSelect from "@components/mainpage/RankingKindSelect";
import TopRanking from "@components/mainpage/TopRanking";

const MainMobilePage = () => {
  const Theme = useTheme();
  const userInfoData = useRecoilValue(userInfoState);
  const languageData = useRecoilValue(languageState);
  const { isLoading, data } = useQuery<NewsType[]>({
    queryKey: ["getHybridNews"],
    queryFn: getHybridNews,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <PageWrapper>
      <MobileLogoHeader />
      <ContentWrapper>
        <RecommandNewsContainer>
          <Title>오늘의 뉴스</Title>
          <DailyNews />
        </RecommandNewsContainer>
        <Divider />
        <RecommandNewsContainer>
          <Title>{userInfoData.nickname} 님의 추천 뉴스</Title>
          {isLoading ? (
            [...Array(5)].map((_, index) => (
              <RecommandNewsDiv key={index} $isLast={index === 4}>
                <div className="img-space">
                  <Spinner />
                </div>
                <LoadingDiv>
                  <LoadingBar />
                </LoadingDiv>
                <LoadingDiv>
                  <LoadingBar />
                </LoadingDiv>
                <LoadingDiv>
                  <LoadingBar />
                </LoadingDiv>
              </RecommandNewsDiv>
            ))
          ) : (
            <div>
              {data?.slice(0, 5).map((news, index) => (
                <RecommandNewsDiv key={news.newsId} $isLast={index === 4}>
                  {news.thumbnailImageUrl ? (
                    <div className="img-space">
                      <img
                        className="thumbnail-img"
                        src={news.thumbnailImageUrl}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="img-space"></div>
                      <img
                        className="default-thumbnail-img"
                        style={{
                          zIndex: 1,
                        }}
                        src={lightThumbnailImage}
                      />
                      <img
                        className="default-thumbnail-img"
                        style={{
                          zIndex: 2,
                          opacity: Theme.mode === "dark" ? 1 : 0,
                          transition: "opacity 0.3s",
                        }}
                        src={darkThumbnailImage}
                      />
                    </>
                  )}

                  <div className="news-info">
                    <div className="title">
                      {languageData === "en" ? news.titleEn : news.titleKr}
                    </div>
                    <div className="category">{news.category}</div>
                  </div>
                </RecommandNewsDiv>
              ))}
            </div>
          )}
        </RecommandNewsContainer>
        <Divider />

        <div style={{ position: "relative", marginTop: "1.5rem" }}>
          <Title>이 달의 랭킹</Title>
          <RankingKindSelect />
        </div>
        <RankingContainer>
          <TopRanking />
        </RankingContainer>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default MainMobilePage;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
`;

const ContentWrapper = styled.main`
  width: 100%;
  max-width: 100%;
  height: calc(100vh-140px);
  box-sizing: border-box;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`;

const RecommandNewsContainer = styled.div`
  background-color: ${(props) => props.theme.colors.cardBackground};
  padding: 1rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 2.5%;
`;

const Title = styled.div`
  padding: 0 1rem;
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0.5rem 0 1rem;
`;
const RecommandNewsDiv = styled.div<{ $isLast: boolean }>`
  display: flex;
  position: relative;
  padding: 0.5rem;
  margin: 0 0.5rem;
  ${(props) =>
    !props.$isLast &&
    `
  border-bottom: 1px solid #0000004f;`}
  &:hover {
    background-color: ${(props) => props.theme.colors.newsItemBackgroundPress};
  }
  border-bottom: 1px solid ${(props) => props.theme.colors.readonly};

  .img-space {
    min-width: 30%;
    width: 30%;
    aspect-ratio: 1.6;
    img {
      width: 100%;
      aspect-ratio: 1.6;
      object-fit: cover;
      border-radius: 5px;
    }
  }
  .default-thumbnail-img {
    position: absolute;
    width: calc(30% - 0.75rem);
    aspect-ratio: 1.6;
  }

  .news-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-left: 1rem;
    font-size: 1.25rem;
    .title {
      font-size: 1rem;
      font-weight: 600;
      line-height: 1.25rem;
      height: auto;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    .category {
      opacity: 0.8;
      font-size: 0.875rem;
      color: ${(props) => props.theme.colors.text04};
      padding: 0.375rem 0rem;
      min-height: 1.5rem;
    }
  }
`;

const RankingContainer = styled.div`
  height: 20rem;
  padding: 0 2rem 90px;
  background-color: ${(props) => props.theme.colors.cardBackground};
`;

const Divider = styled.div`
  height: 1rem;
  margin: 0.5rem 0 0.5rem;
  background-color: ${(props) => props.theme.colors.divider};
  border-top: none;
  border-bottom: none;
`;

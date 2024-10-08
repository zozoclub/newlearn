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
    <>
      <MobileLogoHeader />
      <RecommandNewsContainer>
        <div className="desc">오늘의 뉴스</div>
        <DailyNews />
      </RecommandNewsContainer>
      <RecommandNewsContainer style={{ paddingBottom: "1rem" }}>
        <div className="desc">{userInfoData.nickname} 님의 추천 뉴스</div>
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
      <RankingContainer>
        <RankingKindSelect />
        <TopRanking />
      </RankingContainer>
    </>
  );
};

export default MainMobilePage;

const RecommandNewsContainer = styled.div`
  background-color: ${(props) => props.theme.colors.cardBackground};
  padding: 1rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 2.5%;
  .desc {
    padding: 0 1rem;
    font-size: 1.5rem;
    margin: 0.5rem 0 1rem;
  }
`;

const RecommandNewsDiv = styled.div<{ $isLast: boolean }>`
  display: flex;
  position: relative;
  padding: 1.25rem;
  ${(props) =>
    !props.$isLast &&
    `
  border-bottom: 1px solid #0000004f;`}

  .img-space {
    min-width: 35%;
    width: 35%;
    aspect-ratio: 1.2;
    img {
      width: 100%;
      aspect-ratio: 1.2;
      object-fit: cover;
    }
  }
  .default-thumbnail-img {
    position: absolute;
    width: calc(35% - 0.75rem);
    aspect-ratio: 1.2;
  }

  .news-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-left: 1rem;
    font-size: 1.25rem;
    .title {
      letter-spacing: 0.02rem;
      line-height: 1.25rem;
      height: 3.75rem;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    .category {
      opacity: 0.8;
      font-size: 1rem;
    }
  }
`;

const RankingContainer = styled.div`
  height: 20rem;
  padding: 1rem 2rem 2rem;
  background-color: ${(props) => props.theme.colors.cardBackground};
`;

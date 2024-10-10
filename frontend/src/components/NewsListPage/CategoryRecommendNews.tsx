import { getCategoryRecommandNewsList } from "@services/newsService";
import userInfoState from "@store/userInfoState";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import lightThumbnailImage from "@assets/images/lightThumbnail.png";
import darkThumbnailImage from "@assets/images/darkThumbnail.png";
import languageState from "@store/languageState";
import { usePageTransition } from "@hooks/usePageTransition";
import LoadingBar from "@components/common/LoadingBar";
import Spinner from "@components/Spinner";

const CategoryRecommendNews = () => {
  const userInfoData = useRecoilValue(userInfoState);
  const languageData = useRecoilValue(languageState);
  const transitionTo = usePageTransition();
  const { isLoading, data } = useQuery({
    queryKey: ["getCategoryRecommandNewsList"],
    queryFn: getCategoryRecommandNewsList,
    staleTime: 5 * 60 * 1000,
  });

  const MemoizedComponent = useMemo(() => {
    return (
      <Container>
        {isLoading ? (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                fontSize: "1.25rem",
              }}
            >
              <LoadingBar />
            </div>
            <NewsListDiv id="step8">
              {[...Array(3)].map((_, index) => (
                <NewsDiv key={index}>
                  <NewsInfoDiv>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.25rem",
                      }}
                    >
                      <LoadingBar />
                      <LoadingBar />
                    </div>
                  </NewsInfoDiv>
                  <ThumbnailDiv>
                    <Spinner />
                  </ThumbnailDiv>
                </NewsDiv>
              ))}
            </NewsListDiv>
          </>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                fontSize: "1.25rem",
              }}
            >
              <div className="user-category">
                {userInfoData.categories.map((category, index) => (
                  <div className="category" key={index}>
                    {category}
                    {index !== userInfoData.categories.length - 1 && ","}
                  </div>
                ))}
              </div>
              에 관한 뉴스
            </div>
            <NewsListDiv id="step8">
              {data?.map((news) => (
                <NewsDiv
                  key={news.newsId}
                  onClick={() => transitionTo(`/news/detail/${news.newsId}`)}
                >
                  <NewsInfoDiv>
                    <div className="title">
                      {languageData === "en" ? news.titleEn : news.titleKr}
                    </div>
                    <div className="category">{news.category}</div>
                  </NewsInfoDiv>
                  <ThumbnailDiv>
                    {news.thumbnailImageUrl ? (
                      <ThumbnailImage src={news.thumbnailImageUrl} />
                    ) : (
                      <>
                        <LightThumbnailImage src={lightThumbnailImage} />
                        <DarkThumbnailImage src={darkThumbnailImage} />
                      </>
                    )}
                  </ThumbnailDiv>
                </NewsDiv>
              ))}
            </NewsListDiv>
          </>
        )}
      </Container>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfoData.categories, data, languageData]);

  return MemoizedComponent;
};

export default CategoryRecommendNews;

const Container = styled.div`
  width: 37.5%;
  margin-left: 2.5%;
  height: 28rem;
  border-radius: 0.75rem;
  .user-category {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin-bottom: 1rem;
    .category {
      font-size: 1.5rem;
      font-weight: 600;
    }
  }
  @media (max-width: 1279px) {
    display: none;
  }
`;

const NewsListDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  height: 100%;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const NewsDiv = styled.div`
  display: flex;
  min-height: calc(34% - 1rem - 4px);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.75rem;
  background-color: ${(props) => props.theme.colors.newsItemBackground};
  transform: translateY(0rem);
  transition: backdrop-filter 0.3s, background-color 0.3s, transform 0.3s,
    border 0.3s;
  &:hover {
    transform: translateY(-0.25rem);
    background-color: ${(props) => props.theme.colors.newsItemBackgroundPress};
  }
`;

const NewsInfoDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 55%;
  padding: 2.5%;
  .title {
    height: 2.5rem;
    font-size: 1.25rem;
    font-weight: 500;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .category {
    opacity: 0.8;
  }
`;

const ThumbnailDiv = styled.div`
  position: relative;
  width: 40%;
  height: 100%;
  aspect-ratio: 1.6;
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.5rem;
`;

const LightThumbnailImage = styled(ThumbnailImage)`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
`;

const DarkThumbnailImage = styled(ThumbnailImage)`
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  opacity: ${(props) => (props.theme.mode === "dark" ? 1 : 0)};
  transition: opacity 0.3s;
`;

import { getContentsFilteringRecommendNewsList } from "@services/newsService";
import languageState from "@store/languageState";
import { useQuery } from "@tanstack/react-query";
import { NewsType } from "types/newsType";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled, { useTheme } from "styled-components";
import Spinner from "@components/Spinner";
import LoadingDiv from "./LoadingDiv";
import LoadingBar from "./LoadingBar";
import LightThumbnailImage from "@assets/images/lightThumbnail.png";
import DarkThumbnailImage from "@assets/images/darkThumbnail.png";
import { usePageTransition } from "@hooks/usePageTransition";
import { useMemo } from "react";

const FilteredRecommendNews = () => {
  const languageData = useRecoilValue(languageState);
  const { newsId } = useParams();
  const { isLoading, data } = useQuery<NewsType[]>({
    queryKey: ["getFilteredRecommendNews"],
    queryFn: () => getContentsFilteringRecommendNewsList(Number(newsId)),
    staleTime: 5 * 60 * 1000,
    enabled: newsId !== null,
  });
  const theme = useTheme();
  const transitionTo = usePageTransition();
  const MemoizedComponent = useMemo(() => {
    return (
      <Container>
        <div className="header">이 뉴스와 비슷한 뉴스</div>
        {isLoading ? (
          <div className="recommand-news">
            {[...Array(6)].map((_, index) => (
              <div style={{ display: "flex" }} key={index}>
                <div
                  className="content-div"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.1rem",
                    minHeight: "7.5rem",
                  }}
                >
                  <LoadingDiv>
                    <LoadingBar />
                  </LoadingDiv>
                  <LoadingDiv>
                    <LoadingBar />
                  </LoadingDiv>
                  <LoadingDiv>
                    <LoadingBar />
                  </LoadingDiv>
                </div>
                <div className="thumbnail-div">
                  <Spinner />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="recommand-news">
            {data?.map((news) => (
              <div
                className="news-div"
                key={news.newsId}
                onClick={() => {
                  transitionTo(`/news/detail/${news.newsId}`);
                }}
              >
                <div className="content-div">
                  <div>
                    {languageData === "en" ? news.titleEn : news.titleKr}
                  </div>
                </div>
                <div className="thumbnail-div">
                  {news.thumbnailImageUrl ? (
                    <img src={news.thumbnailImageUrl} />
                  ) : (
                    <>
                      <img
                        style={{ position: "absolute", top: 0, left: 0 }}
                        src={LightThumbnailImage}
                      />
                      <img
                        style={{
                          position: "absolute",
                          zIndex: 2,
                          top: 0,
                          left: 0,
                          opacity: theme.mode === "dark" ? 1 : 0,
                          transition: "opacity 0.5s",
                        }}
                        src={DarkThumbnailImage}
                      />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    );
  }, [data]);

  return MemoizedComponent;
};

export default FilteredRecommendNews;

const Container = styled.div`
  border-radius: 0.75rem;
  width: 30%;
  padding: 0 0 2% 0;
  .header {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    padding: 0.5rem;
  }
  .recommand-news {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .news-div {
    display: flex;
    border-radius: 0.5rem;
    padding: 0.5rem;
    background-color: ${(props) =>
      props.theme.mode === "dark" ? "transparent" : "#ffffffaa"};
    backdrop-filter: blur(10px);
    border: 2px solid
      ${(props) => (props.theme.mode === "dark" ? "#1a1a1aaa" : "#e2e2e2aa")};
    cursor: pointer;
    transform: translateY(0rem);
    transition: background-color 0.3s, transform 0.3s, border 0.3s,
      backdrop-filter 0.3s;
    &:hover {
      background-color: ${(props) =>
        props.theme.mode === "dark"
          ? props.theme.colors.cardBackground01
          : "transparent"};
      transform: translateY(-0.25rem);
    }
  }
  .content-div {
    width: 52.5%;
    padding: 0 2.5% 0 0;
    font-size: 1.125rem;
    line-height: 1.25rem;
    height: 3.75rem;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }
  .thumbnail-div {
    position: relative;
    width: 45%;
    aspect-ratio: 1.6;
    img {
      width: 100%;
      aspect-ratio: 1.6;
      object-fit: cover;
      border-radius: 0.5rem;
    }
  }
  @media (max-width: 1279px) {
    width: 98%;
    .content-div {
      width: 67.5%;
    }
    .thumbnail-div {
      width: 30%;
    }
  }
`;

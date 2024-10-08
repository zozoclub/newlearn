import { getContentsFilteringRecommendNewsList } from "@services/newsService";
import languageState from "@store/languageState";
import { useQuery } from "@tanstack/react-query";
import { NewsType } from "types/newsType";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useTheme } from "styled-components";
import Spinner from "@components/Spinner";
import LoadingDiv from "../common/LoadingDiv";
import LoadingBar from "../common/LoadingBar";
import LightThumbnailImage from "@assets/images/lightThumbnail.png";
import DarkThumbnailImage from "@assets/images/darkThumbnail.png";
import { usePageTransition } from "@hooks/usePageTransition";
import { useMemo } from "react";

const FilteredRecommendNews = () => {
  const languageData = useRecoilValue(languageState);
  const { newsId } = useParams();
  const { isLoading, data } = useQuery<NewsType[]>({
    queryKey: ["getFilteredRecommendNews", Number(newsId)],
    queryFn: () => getContentsFilteringRecommendNewsList(Number(newsId)),
    staleTime: 5 * 60 * 1000,
    enabled: newsId !== null,
  });
  const theme = useTheme();
  const transitionTo = usePageTransition();
  const MemoizedComponent = useMemo(() => {
    return (
      <>
        <div className="header">
          {languageData === "en" ? "Related News" : "연관 뉴스"}
        </div>
        {isLoading ? (
          <div className="recommand-news">
            {[...Array(5)].map((_, index) => (
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
            {data?.slice(0, Math.min(data?.length, 5)).map((news) => (
              <div
                className="news-div"
                key={news.newsId}
                onClick={() => {
                  transitionTo(`/news/detail/${news.newsId}`);
                }}
              >
                <div className="content-div">
                  <div className="title">
                    {languageData === "en" ? news.titleEn : news.titleKr}
                  </div>
                  <div className="category">{news.category}</div>
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
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, languageData]);

  return MemoizedComponent;
};

export default FilteredRecommendNews;

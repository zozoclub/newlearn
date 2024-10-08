import languageState from "@store/languageState";
import { useQuery } from "@tanstack/react-query";
import { NewsType } from "types/newsType";
import { useRecoilValue } from "recoil";
import { getRecentReadNews } from "@services/newsService";
import { useParams } from "react-router-dom";
import { usePageTransition } from "@hooks/usePageTransition";
import { useMemo } from "react";
import { useTheme } from "styled-components";
import LoadingBar from "../common/LoadingBar";
import LoadingDiv from "../common/LoadingDiv";
import Spinner from "@components/Spinner";
import LightThumbnailImage from "@assets/images/lightThumbnail.png";
import DarkThumbnailImage from "@assets/images/darkThumbnail.png";

const RecentReadNews = () => {
  const languageData = useRecoilValue(languageState);
  const { newsId } = useParams();
  const { isLoading, data } = useQuery<NewsType[]>({
    queryKey: ["getRecentReadNews", Number(newsId)],
    queryFn: getRecentReadNews,
    enabled: newsId !== null,
    staleTime: 5 * 60 * 1000,
  });
  const theme = useTheme();
  const transitionTo = usePageTransition();
  const MemoizedComponent = useMemo(() => {
    return (
      <>
        <div className="header">최근 읽은 뉴스</div>
        {isLoading ? (
          <div className="recent-news">
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
          <div className="recent-news">
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
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, languageData]);

  return MemoizedComponent;
};

export default RecentReadNews;

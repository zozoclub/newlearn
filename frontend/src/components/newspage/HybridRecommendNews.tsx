import { useQuery } from "@tanstack/react-query";
import { NewsType } from "types/newsType";
import { useMemo } from "react";
import styled from "styled-components";
import { getHybridNews } from "@services/newsService";
import Spinner from "@components/Spinner";
import { useRecoilValue } from "recoil";
import languageState from "@store/languageState";
import userInfoState from "@store/userInfoState";
import NewsSwiper from "@components/common/NewsSwiper";

const HybridRecommendNews = () => {
  const languageData = useRecoilValue(languageState);
  const userInfoData = useRecoilValue(userInfoState);
  const { isLoading, data } = useQuery<NewsType[]>({
    queryKey: ["getHybridNews"],
    queryFn: getHybridNews,
    staleTime: 5 * 60 * 1000,
  });
  const MemoizedComponent = useMemo(
    () => {
      return (
        <Container>
          {isLoading ? (
            <div>
              <Spinner />
            </div>
          ) : (
            data && (
              <>
                {languageData === "en" ? (
                  <RecommendPhrase>
                    Recommend News for
                    <div className="user-nickname">{userInfoData.nickname}</div>
                  </RecommendPhrase>
                ) : (
                  <RecommendPhrase>
                    <div className="user-nickname">{userInfoData.nickname}</div>
                    님을 위한 추천 뉴스
                  </RecommendPhrase>
                )}
                <NewsSwiper
                  variety={"hybrid"}
                  newsList={data}
                  height={380}
                  sildesPerView={1.5}
                />
              </>
            )
          )}
        </Container>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, languageData]
  );

  return MemoizedComponent;
};

export default HybridRecommendNews;

const Container = styled.div`
  width: 60%;
  margin: auto 0;
  border-radius: 0.75rem;
  @media (max-width: 1279px) {
    width: 100%;
  }
`;

const RecommendPhrase = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: 1.25rem;
  .user-nickname {
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

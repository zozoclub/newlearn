import styled from "styled-components";
import "swiper/css";
import "swiper/css/parallax";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { useQuery } from "@tanstack/react-query";
import { getTopNewsList } from "@services/newsService";
import { useRecoilValue } from "recoil";
import userInfoState from "@store/userInfoState";
import languageState from "@store/languageState";
import NewsSwiper from "@components/common/NewsSwiper";
import { useMediaQuery } from "react-responsive";
import Spinner from "@components/Spinner";

const DailyNews = () => {
  const userInfoData = useRecoilValue(userInfoState);
  const languageData = useRecoilValue(languageState);
  const isTablet = useMediaQuery({ query: "(max-width: 1279px)" });

  const { data: dailyNewsList, isLoading } = useQuery({
    queryKey: ["dailyNewsList", userInfoData, languageData],
    queryFn: () => getTopNewsList(userInfoData.difficulty, languageData),
    staleTime: 5 * 60 * 1000, // 5분 동안 데이터를 신선한 상태로 유지
    enabled: userInfoData.isInitialized,
  });

  if (isLoading)
    return (
      <Container style={{ display: "flex", alignItems: "center" }}>
        <Spinner />
      </Container>
    );

  return (
    <Container>
      {dailyNewsList && (
        <NewsSwiper
          variety={"daily"}
          newsList={dailyNewsList}
          slidesPerView={isTablet ? 1 : 1.5}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  @media screen and (min-width: 1280px) {
    top: 10rem;
    width: 55vw;
    aspect-ratio: 1.6;
  }
  @media screen and (min-width: 768px) and (max-width: 1279px) {
    width: 50vw;
    aspect-ratio: 2;
    overflow: hidden;
  }
  @media screen and (max-width: 767px) {
    width: 100vw;
    aspect-ratio: 1.5;
  }
`;

export default DailyNews;

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

const DailyNews = () => {
  const userInfoData = useRecoilValue(userInfoState);
  const languageData = useRecoilValue(languageState);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const { data: dailyNewsList, isLoading } = useQuery({
    queryKey: ["dailyNewsList", userInfoData, languageData],
    queryFn: () => getTopNewsList(userInfoData.difficulty, languageData),
    staleTime: 5 * 60 * 1000, // 5분 동안 데이터를 신선한 상태로 유지
    enabled: userInfoData.isInitialized,
  });

  if (isLoading) return <div>Loading news...</div>;

  return (
    <Container>
      {dailyNewsList && (
        <NewsSwiper
          variety={"daily"}
          newsList={dailyNewsList}
          height={440}
          sildesPerView={isMobile ? 1 : 1.5}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  top: 10rem;
  width: 50vw;
  overflow: hidden;
  @media screen and (max-width: 767px) {
    width: 100vw;
    aspect-ratio: 1.6;
  }
`;

export default DailyNews;

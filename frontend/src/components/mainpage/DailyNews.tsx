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

const DailyNews = () => {
  const userInfoData = useRecoilValue(userInfoState);
  const languageData = useRecoilValue(languageState);
  const difficulty = userInfoData.difficulty;

  const { data: dailyNewsList, isLoading } = useQuery({
    queryKey: ["dailyNewsList", difficulty, languageData],
    queryFn: () => getTopNewsList(difficulty, languageData),
    staleTime: 5 * 60 * 1000, // 5분 동안 데이터를 신선한 상태로 유지
  });

  if (isLoading) return <div>Loading news...</div>;

  return (
    <Container>
      {dailyNewsList && (
        <NewsSwiper variety={"daily"} newsList={dailyNewsList} height={440} />
      )}
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  top: 10rem;
  width: 50vw;
  overflow: hidden;
`;

export default DailyNews;

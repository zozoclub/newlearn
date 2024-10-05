import React from "react";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/parallax";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { useQuery } from "@tanstack/react-query";
import { getTopNewsList } from "@services/newsService";
import { useRecoilValue } from "recoil";
import userInfoState from "@store/userInfoState";
import languageState from "@store/languageState";
import { usePageTransition } from "@hooks/usePageTransition";
import NewsSlide from "./NewsSlide";

const DailyNews: React.FC = () => {
  const userInfoData = useRecoilValue(userInfoState);
  const languageData = useRecoilValue(languageState);
  const difficulty = userInfoData.difficulty;
  const transitionTo = usePageTransition();

  const { data: dailyNewsList, isLoading } = useQuery({
    queryKey: ["dailyNewsList", difficulty, languageData],
    queryFn: () => getTopNewsList(difficulty, languageData),
    staleTime: 5 * 60 * 1000, // 5분 동안 데이터를 신선한 상태로 유지
  });

  if (isLoading) return <div>Loading news...</div>;

  return (
    <Container>
      <Swiper
        loop={true}
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        speed={500}
        mousewheel={true}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 0.75,
          scale: 0.75,
        }}
        pagination={true}
        modules={[EffectCoverflow, Pagination, Mousewheel]}
        className="mySwiper"
      >
        {dailyNewsList?.map((news) => (
          <SwiperSlide
            key={news.newsId}
            onClick={() => transitionTo(`/news/detail/${news.newsId}`)}
          >
            <NewsSlide
              image={news.thumbnailImageUrl}
              title={news.title}
              content={news.content}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
};

const Container = styled.div`
  justify-content: flex-start;
  position: absolute;
  top: 10rem;
  left: -35vw;
  width: calc(130vw - 0.375rem);
  overflow: hidden;

  .swiper {
    padding-top: 50px;
    padding-bottom: 50px;
  }

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 600px;
    height: 360px;
    background-color: ${(props) => props.theme.colors.cardBackground + "BF"};
    border-radius: 0.5rem;
    backdrop-filter: blur(4px);
    box-shadow: ${(props) => props.theme.shadows.medium};
    transition: all 0.3s ease;
  }

  .swiper .swiper-slide::after {
    position: absolute;
    top: 0;
    left: 0;
    width: 80px;
    height: 80px;
    border-top: 1px solid ${(props) => props.theme.colors.placeholder + "AA"};
    border-left: 1px solid #ffffffaa;
    border-radius: 7px 0 0 0;
    content: "";
    transition: width 0.3s ease, height 0.3s ease;
  }

  .swiper .swiper-slide:hover {
    background: linear-gradient(
      135deg,
      rgba(0, 153, 255, 0.2),
      rgba(0, 153, 255, 0.4),
      rgba(0, 153, 255, 0.6),
      rgba(0, 153, 255, 0.8),
      #0099ff
    );
  }

  .swiper .swiper-slide:hover::after {
    width: 170px;
    height: 170px;
  }
`;

export default DailyNews;

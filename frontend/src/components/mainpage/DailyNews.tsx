import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/parallax";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import NewsSlide from "./NewsSlide";
import { useQuery } from "@tanstack/react-query";
import { getTopNewsList } from "@services/newsService";
import { useRecoilValue } from "recoil";
import userInfoState from "@store/userInfoState";

const DailyNews: React.FC = () => {
  const userInfoData = useRecoilValue(userInfoState);
  const difficulty = userInfoData.difficulty;
  const { data: dailyNewsList } = useQuery({
    queryKey: ["dailyNewsList", difficulty],
    queryFn: () => getTopNewsList(difficulty, "en"),
  });

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
          modifier: 1,
          slideShadows: true,
        }}
        pagination={true}
        modules={[EffectCoverflow, Pagination, Mousewheel]}
        className="mySwiper"
      >
        {dailyNewsList?.map((news, index) => (
          <SwiperSlide key={index}>
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
  top: 7.5rem;
  left: -30vw;
  width: calc(125vw - 0.375rem);
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
    height: 400px;
    background-color: ${(props) => props.theme.colors.cardBackground + "BF"};
    border-radius: 0.5rem;
    backdrop-filter: blur(4px);
    box-shadow: 0.5rem 0.5rem 0.25rem ${(props) => props.theme.colors.shadow};
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
    transition: width 0.3s ease, height 0.3s ease;
  }
  img {
    width: 580px;
    height: 380px;
    border-radius: 0.5rem;
    opacity: 0.9;
  }
`;

export default DailyNews;

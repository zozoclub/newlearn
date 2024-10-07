import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/parallax";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { NewsType } from "types/newsType";
import NewsSlide from "@components/mainpage/NewsSlide";
import { usePageTransition } from "@hooks/usePageTransition";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import languageState from "@store/languageState";

type NewsSwiperProps = {
  variety: "daily" | "hybrid";
  newsList: NewsType[];
  height: number;
  sildesPerView: number;
};

const NewsSwiper: React.FC<NewsSwiperProps> = ({
  variety,
  newsList,
  height,
  sildesPerView,
}) => {
  const transitionTo = usePageTransition();
  const languageData = useRecoilValue(languageState);

  return (
    <Container>
      <Swiper
        loop={true}
        effect={"slide"} // coverflow 대신 기본 slide 효과 사용
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={sildesPerView} // 한 번에 1.5개의 슬라이드가 보이도록 설정
        spaceBetween={-50} // 음수 값을 주어 슬라이드가 겹치도록 설정
        speed={500}
        mousewheel={true}
        pagination={true}
        modules={[Pagination, Mousewheel]} // EffectCoverflow 제거
        className="mySwiper"
      >
        {newsList?.map((news) => (
          <SwiperSlide
            key={news.newsId}
            style={{ height: height }}
            onClick={() => transitionTo(`/news/detail/${news.newsId}`)}
          >
            <NewsSlide
              image={news.thumbnailImageUrl}
              title={
                variety === "daily"
                  ? news.title!
                  : languageData === "en"
                  ? news.titleEn!
                  : news.titleKr!
              }
              content={
                variety === "daily"
                  ? news.content!
                  : languageData === "en"
                  ? news.contentEn!
                  : news.contentKr!
              }
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
};

export default NewsSwiper;

const Container = styled.div`
  .swiper {
    padding-bottom: 70px;
  }
  .swiper-pagination-bullet {
    background-color: ${(props) =>
      props.theme.colors.placeholder}; // 기본 도트 색상
    opacity: 0.6; // 도트의 투명도
  }

  .swiper-pagination-bullet-active {
    background-color: ${(props) =>
      props.theme.colors.primary}; // 활성화된 도트 색상
    opacity: 1; // 활성화된 도트의 투명도
  }
  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 580px;
    height: 440px;
    background-color: ${(props) => props.theme.colors.cardBackground + "BF"};
    border-radius: 0.5rem;
    backdrop-filter: blur(4px);
    box-shadow: ${(props) => props.theme.shadows.small};
    transition: all 0.3s ease;
    opacity: 0.5; // 기본적으로 모든 슬라이드를 연하게 설정
    transform: scale(0.9); // 기본적으로 모든 슬라이드를 약간 축소
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
    background: ${(props) => props.theme.colors.text04};
  }

  .swiper .swiper-slide:hover::after {
    width: 170px;
    height: 170px;
  }

  .swiper-slide-active {
    opacity: 1;
    transform: scale(1);
    z-index: 2;
  }

  .swiper-slide-prev,
  .swiper-slide-next {
    z-index: 1;
  }
`;

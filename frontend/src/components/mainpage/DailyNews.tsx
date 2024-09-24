import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/parallax";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

const DailyNews: React.FC = () => {
  return (
    <Container>
      <Swiper
        loop={true}
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        speed={1000}
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
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-1.jpg" />
          <NewsContent>
            <h1>뉴스 제목</h1>
            <div>뉴스 내용 --------------------- 뉴스 내용</div>
          </NewsContent>
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-2.jpg" />
          <NewsContent>
            <h1>뉴스 제목</h1>
            <div>뉴스 내용 --------------------- 뉴스 내용</div>
          </NewsContent>
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-3.jpg" />
          <NewsContent>
            <h1>뉴스 제목</h1>
            <div>뉴스 내용 --------------------- 뉴스 내용</div>
          </NewsContent>
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-4.jpg" />
          <NewsContent>
            <h1>뉴스 제목</h1>
            <div>뉴스 내용 --------------------- 뉴스 내용</div>
          </NewsContent>
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-5.jpg" />
          <NewsContent>
            <h1>뉴스 제목</h1>
            <div>뉴스 내용 --------------------- 뉴스 내용</div>
          </NewsContent>
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-6.jpg" />
          <NewsContent>
            <h1>뉴스 제목</h1>
            <div>뉴스 내용 --------------------- 뉴스 내용</div>
          </NewsContent>
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-7.jpg" />
          <NewsContent>
            <h1>뉴스 제목</h1>
            <div>뉴스 내용 --------------------- 뉴스 내용</div>
          </NewsContent>
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-8.jpg" />
          <NewsContent>
            <h1>뉴스 제목</h1>
            <div>뉴스 내용 --------------------- 뉴스 내용</div>
          </NewsContent>
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-9.jpg" />
          <NewsContent>
            <h1>뉴스 제목</h1>
            <div>뉴스 내용 --------------------- 뉴스 내용</div>
          </NewsContent>
        </SwiperSlide>
      </Swiper>
    </Container>
  );
};

const Container = styled.div`
  display: absolute;
  justify-content: flex-start;
  position: absolute;
  top: 5rem;
  left: -5vw;
  width: 100vw;
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
  .swiper .swiper-slide::before {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 80px;
    height: 80px;
    border-bottom: 1px dashed white;
    border-right: 1px solid white;
    border-radius: 0 0 7px 0;
    content: "";
    transition: all 0.3s ease;
  }

  .swiper .swiper-slide::after {
    position: absolute;
    top: 0;
    left: 0;
    width: 80px;
    height: 80px;
    border-top: 1px solid white;
    border-left: 1px dashed white;
    border-radius: 7px 0 0 0;
    content: "";
    transition: all 0.3s ease;
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

  .swiper .swiper-slide:hover::before,
  .swiper .swiper-slide:hover::after {
    width: 170px;
    height: 170px;
    transition: all 0.3s ease;
  }
  img {
    width: 580px;
    height: 380px;
    border-radius: 0.5rem;
    opacity: 0.9;
  }
`;

const NewsContent = styled.div`
  position: absolute;
  bottom: 0rem;
  left: 0rem;
  width: calc(100% - 4rem);
  margin: 1rem;
  padding: 2rem 1rem;
  border-radius: 0.5rem;
  background-color: ${(props) => props.theme.colors.cardBackground + "33"};
  color: #ffffff;
  h1 {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  div {
    font-size: 1rem;
  }
`;

export default DailyNews;

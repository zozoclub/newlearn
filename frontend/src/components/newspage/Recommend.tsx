import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useQuery } from "@tanstack/react-query";
import { getHybridNews, NewsType } from "@services/newsService";
import Spinner from "@components/Spinner";

const Recommend = () => {
  const { isLoading, data } = useQuery<NewsType[]>({
    queryKey: ["getHybridNews"],
    queryFn: getHybridNews,
  });

  return (
    <Container>
      <HybridRecommandContainer>
        {isLoading ? (
          <div>
            <Spinner />
          </div>
        ) : (
          <Swiper
            loop={true}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            speed={500}
            mousewheel={true}
            pagination={true}
            modules={[Pagination, Mousewheel]}
            className="mySwiper"
          >
            {data?.map((news) => (
              <SwiperSlide>
                <img style={{ width: "100%" }} src={news.thumbnailImageUrl} />
                <div>{news.content}</div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </HybridRecommandContainer>
      <CategoryRecommandContainer>
        카테고리 기반 추천
      </CategoryRecommandContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  height: 30rem;
`;

const HybridRecommandContainer = styled.div`
  width: 60%;
  border-radius: 0.75rem;
`;

const CategoryRecommandContainer = styled.div`
  width: 40%;
  background-color: yellow;
  border-radius: 0.75rem;
`;

export default Recommend;

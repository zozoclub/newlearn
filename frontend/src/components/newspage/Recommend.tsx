import styled from "styled-components";
import "swiper/css";
import "swiper/css/pagination";
import HybridRecommendNews from "./HybridRecommendNews";
import CategoryRecommendNews from "./CategoryRecommendNews";

const Recommend = () => {
  return (
    <Container>
      <HybridRecommendNews />
      <CategoryRecommendNews />
    </Container>
  );
};

const Container = styled.div`
  @media screen and (min-width: 768px) {
    display: flex;
    min-height: 30rem;
  }
`;

export default Recommend;

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
  display: flex;
  min-height: 30rem;
  @media (max-width: 1279px) {
    flex-direction: column;
  }
`;

export default Recommend;

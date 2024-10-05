import styled from "styled-components";
import "swiper/css";
import "swiper/css/pagination";
import HybridRecommandNews from "./HybridRecommandNews";
import CategoryRecommandNews from "./CategoryRecommandNews";

const Recommend = () => {
  return (
    <Container>
      <HybridRecommandNews />
      <CategoryRecommandNews />
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

import styled from "styled-components";

const Recommand = () => {
  return (
    <Container>
      <HybridRecommandContainer>
        <div>하이브리드 추천</div>
        <div>
          <div>슬라이드</div>
          <div>
            <div>제목</div>
            <div>태그</div>
          </div>
        </div>
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
  background-color: gray;
  border-radius: 0.75rem;
`;

const CategoryRecommandContainer = styled.div`
  width: 40%;
  background-color: yellow;
  border-radius: 0.75rem;
`;

export default Recommand;

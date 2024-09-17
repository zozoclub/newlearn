import styled from "styled-components";
const Container = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  margin: 0 3rem;
`;
const TitleContainer = styled.div`
  display: flex;
  flex: 3;
  flex-direction: column;
  gap: 2rem;
  font-size: 1.25rem;
  font-weight: bold;
`;
const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  font-size: 1.25rem;
  /* font-weight: bold; */
`;
const MyPageCount = () => {
  const readCount = 20;
  const vocaCount = 30;
  const scrapCount = 23;

  const items = [
    { title: "내가 읽은 기사", count: readCount },
    { title: "내가 저장한 단어", count: vocaCount },
    { title: "내가 스크랩한 기사", count: scrapCount },
  ];
  return (
    <Container>
      <TitleContainer>
        {items.map((item) => (
          <div key={item.title}>{item.title}</div>
        ))}
      </TitleContainer>
      <ContentContainer>
        {items.map((item) => (
          <div key={item.title}>{item.count}</div>
        ))}
      </ContentContainer>
    </Container>
  );
};

export default MyPageCount;

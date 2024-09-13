import styled from "styled-components";

const NewsListHeader = () => {
  const categoryList = [
    { name: "전체" },
    { name: "경제" },
    { name: "사회" },
    { name: "연예" },
  ];
  return (
    <Container>
      <CategoryContainer>
        {categoryList.map((category) => (
          <CategoryItem key={category.name}>
            <div>{category.name}</div>
            <FocusEffect />
          </CategoryItem>
        ))}
      </CategoryContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  padding: 2.5% 5%;
`;

const CategoryContainer = styled.div`
  display: flex;
  width: 80%;
  gap: 7.5%;
`;

const CategoryItem = styled.div`
  position: relative;
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
`;

const FocusEffect = styled.div`
  position: absolute;
  left: 50%;
  transform: translate(-50%);
  width: 3rem;
  height: 0.25rem;
  background-color: ${(props) => props.theme.colors.primary};
`;

export default NewsListHeader;

import styled from "styled-components";

const NewsListHeader: React.FC<{
  selectedCategory: number;
  setSelectedCategory: React.Dispatch<React.SetStateAction<number>>;
}> = ({ selectedCategory, setSelectedCategory }) => {
  const categoryList = [
    { name: "전체" },
    { name: "경제" },
    { name: "사회" },
    { name: "연예" },
    { name: "IT/과학" },
    { name: "몰라" },
  ];

  return (
    <Container>
      <CategoryContainer>
        {categoryList.map((category, index) => (
          <CategoryItem
            key={category.name}
            onClick={() => {
              setSelectedCategory(index);
            }}
          >
            {category.name}
          </CategoryItem>
        ))}
        <FocusEffect $categoryId={selectedCategory} />
      </CategoryContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
`;

const CategoryContainer = styled.div`
  display: flex;
  position: relative;
  width: 50%;
`;

const CategoryItem = styled.div`
  width: 16.6666%;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
`;

const FocusEffect = styled.div<{ $categoryId: number }>`
  position: absolute;
  left: ${(props) => (100 / 6) * props.$categoryId}%;
  bottom: 0;
  transform: translate(33%, 0);
  width: 10%;
  height: 1rem;
  transition: left 0.3s;
  border-bottom: 0.175rem ${(props) => props.theme.colors.primary + "AA"};
  box-shadow: 0 0.75rem 0.25rem -0.25rem ${(props) => props.theme.colors.primary + "AA"};
`;

export default NewsListHeader;

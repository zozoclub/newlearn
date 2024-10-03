import { usePageTransition } from "@hooks/usePageTransition";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const NewsListHeader: React.FC = () => {
  const categoryList = [
    { name: "전체" },
    { name: "정치" },
    { name: "경제" },
    { name: "사회" },
    { name: "생활/문화" },
    { name: "IT/과학" },
    { name: "세계" },
  ];
  const transitionTo = usePageTransition();
  const { category } = useParams();
  const selectedCategory = Number(category);

  return (
    <Container>
      <CategoryContainer>
        {categoryList.map((category, index) => (
          <CategoryItem
            key={category.name}
            onClick={() => {
              transitionTo(`/news/${index}/1`);
            }}
            $isSelected={selectedCategory === index}
          >
            {category.name}
          </CategoryItem>
        ))}
      </CategoryContainer>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const CategoryContainer = styled.div`
  display: flex;
  gap: 5%;
`;

const CategoryItem = styled.div<{ $isSelected?: boolean }>`
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  white-space: nowrap;
  color: ${(props) =>
    props.$isSelected ? props.theme.colors.primary : props.theme.colors.text};
`;

export default NewsListHeader;

import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import NewsSearch from "@components/newspage/NewsSearch";
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
  const { category } = useParams();
  const selectedCategory = Number(category);
  const navigate = useNavigate();

  return (
    <HeaderContainer>
      <Container>
        <CategoryContainer>
          {categoryList.map((category, index) => (
            <CategoryItem
              key={category.name}
              onClick={() => {
                navigate(`/news/${index}/1`);
              }}
              $isSelected={selectedCategory === index}
            >
              {category.name}
            </CategoryItem>
          ))}
          <NewsSearch />
        </CategoryContainer>
      </Container>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Container = styled.div`
  position: relative;
  width: 100%;
`;

const CategoryContainer = styled.div`
  display: flex;
  align-items: center;
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

import { useNavigate, useParams } from "react-router-dom";
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
          {/* <NewsSearch /> */}
        </CategoryContainer>
      </Container>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 50vw;
  @media (max-width: 1279px) {
    position: absolute;
    top: 10.5rem;
    left: 5%;
    width: 80vw;
  }
  @media (max-width: 767px) {
    position: sticky;
    top: 0;
    left: 0;
    width: 95%;
    margin: 0 auto;
    padding: 1.5rem 0;
    background-color: transparent;
    z-index: 10;
  }
`;

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const CategoryContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const CategoryItem = styled.div<{ $isSelected?: boolean }>`
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  white-space: nowrap;
  color: ${(props) =>
    props.$isSelected ? props.theme.colors.primary : props.theme.colors.text};

  @media (max-width: 767px) {
    font-size: 1rem;
  }
`;
export default NewsListHeader;

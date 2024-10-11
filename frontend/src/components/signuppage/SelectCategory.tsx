import Button from "@components/Button";
import { categoriesState } from "@store/signUpState";
import { useRecoilState } from "recoil";
import styled from "styled-components";

const categories = [
  { name: "정치" },
  { name: "경제" },
  { name: "사회" },
  { name: "생활/문화" },
  { name: "세계" },
  { name: "IT/과학" },
];

const SelectCategory = () => {
  const [categoriesValue, setCategoriesState] = useRecoilState(categoriesState);
  const handleCategoryClick = (categoryName: string) => {
    setCategoriesState((prevCategories) => {
      if (prevCategories.includes(categoryName)) {
        // 이미 선택된 카테고리라면 제거
        return prevCategories.filter((cat) => cat !== categoryName);
      } else if (prevCategories.length < 3) {
        // 카테고리가 3개 미만일 때만 추가
        return [...prevCategories, categoryName];
      }
      return prevCategories; // 카테고리가 3개 이상이면 변경하지 않음
    });
  };

  return (
    <div className="category">
      <div className="desc">
        관심 카테고리
        <CategoryCount>{categoriesValue.length}/3</CategoryCount>
      </div>
      <div className="buttons">
        {categories.map((category) => (
          <Button
            key={category.name}
            $varient={
              categoriesValue.includes(category.name) ? "primary" : "cancel"
            }
            size={"medium"}
            onClick={() => {
              handleCategoryClick(category.name);
            }}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

const CategoryCount = styled.div`
  margin-left: 0.5rem;
  color: ${(props) => props.theme.colors.primary};
  font-size: 1rem;
`;

export default SelectCategory;

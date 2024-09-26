import Button from "@components/Button";
import signupState from "@store/signupState";
import { useRecoilState } from "recoil";
import styled from "styled-components";

const categories = [
  { name: "전체" },
  { name: "경제" },
  { name: "사회" },
  { name: "연예" },
  { name: "IT/과학" },
  { name: "몰라" },
];

const SelectCategory = () => {
  const [signupData, setSignupData] = useRecoilState(signupState);
  const selectedCategories = signupData.categories;

  const handleCategoryClick = (categoryName: string) => {
    setSignupData((prevState) => ({
      ...prevState,
      categories: prevState.categories.includes(categoryName)
        ? prevState.categories.filter((name) => name !== categoryName)
        : prevState.categories.length < 3
        ? [...prevState.categories, categoryName]
        : prevState.categories,
    }));
  };

  return (
    <div className="category">
      <div className="desc">
        관심 카테고리
        <CategoryCount>{selectedCategories.length}/3</CategoryCount>
      </div>
      <div className="buttons">
        {categories.map((category) => (
          <Button
            key={category.name}
            $varient={
              selectedCategories.includes(category.name) ? "primary" : "cancel"
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

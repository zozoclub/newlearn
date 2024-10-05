import Button from "@components/Button";
import {
  CheckAction,
  CheckActionObject,
  SignUpAction,
  SignUpActionObject,
  SignUpStateType,
} from "types/signUpType";
import { Dispatch, useEffect } from "react";
import styled from "styled-components";

const categories = [
  { name: "정치" },
  { name: "경제" },
  { name: "사회" },
  { name: "생활/문화" },
  { name: "세계" },
  { name: "IT/과학" },
];

type SelectCategoryProps = {
  signUpState: SignUpStateType;
  signUpDispatch: Dispatch<SignUpActionObject>;
  checkDispatch: Dispatch<CheckActionObject>;
};

const SelectCategory: React.FC<SelectCategoryProps> = ({
  signUpState,
  signUpDispatch,
  checkDispatch,
}) => {
  const handleCategoryClick = (categoryName: string) => {
    signUpDispatch({
      type: SignUpAction.CHANGE_CATEGORIES,
      payload: categoryName,
    });
  };

  useEffect(() => {
    checkDispatch({
      type: CheckAction.CHECK_CATEGORIES,
      payload: signUpState.categories,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signUpState.categories]);

  return (
    <div className="category">
      <div className="desc">
        관심 카테고리
        <CategoryCount>{signUpState.categories.length}/3</CategoryCount>
      </div>
      <div className="buttons">
        {categories.map((category) => (
          <Button
            key={category.name}
            $varient={
              signUpState.categories.includes(category.name)
                ? "primary"
                : "cancel"
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

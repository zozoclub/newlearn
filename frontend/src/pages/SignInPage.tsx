import BackArrow from "@assets/icons/BackArrow";
import Button from "@components/Button";
import { useState } from "react";
import styled from "styled-components";

const SignInPage = () => {
  const categories = [
    { name: "전체" },
    { name: "경제" },
    { name: "사회" },
    { name: "연예" },
    { name: "IT/과학" },
    { name: "몰라" },
  ];
  const difficulties = [
    { difficulty: "초급" },
    { difficulty: "중급" },
    { difficulty: "고급" },
  ];
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory((prevSelected) => {
      if (prevSelected.includes(categoryName)) {
        return prevSelected.filter((name) => name !== categoryName);
      } else if (prevSelected.length < 3) {
        return [...prevSelected, categoryName];
      }
      return prevSelected;
    });
  };

  const handleDifficultyClick = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
  };

  return (
    <Container>
      <div className="header">
        <div className="back-arrow">
          <BackArrow width={36} height={36} />
        </div>
        회원가입
      </div>
      <form onSubmit={(event) => event.preventDefault()}>
        <div className="nickname">
          <input placeholder="닉네임 (최소 2자에서 최대 8자의 한글)" />
        </div>
        <div className="category">
          <div className="desc">관심 카테고리</div>
          <div className="buttons">
            {categories.map((category) => (
              <Button
                key={category.name}
                $varient={
                  selectedCategory.includes(category.name)
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
        <div className="difficulty">
          <div className="desc">영어 실력</div>
          <div className="buttons">
            {difficulties.map((difficulty) => (
              <Button
                key={difficulty.difficulty}
                $varient={
                  selectedDifficulty === difficulty.difficulty
                    ? "primary"
                    : "cancel"
                }
                size={"medium"}
                onClick={() => handleDifficultyClick(difficulty.difficulty)}
              >
                {difficulty.difficulty}
              </Button>
            ))}
          </div>
        </div>
        <div className="submit-button">
          <Button $varient={"cancel"} size="large" onClick={() => {}}>
            입력 완료
          </Button>
        </div>
      </form>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 10%);
  width: 27.25rem;
  padding: 2rem 2rem 2rem 2rem;
  border-radius: 0.5rem;
  background-color: ${(props) => props.theme.colors.cardBackground + "7F"};
  transition: box-shadow 0.5s;
  backdrop-filter: blur(4px);
  box-shadow: 0.5rem 0.5rem 0.25rem ${(props) => props.theme.colors.shadow};
  ::placeholder {
    font-weight: 600;
    color: ${(props) => props.theme.colors.placeholder};
  }
  .header {
    display: flex;
    position: relative;
    width: 100%;
    font-size: 1.75rem;
    justify-content: center;
    align-items: center;
    .back-arrow {
      position: absolute;
      left: 0;
    }
  }
  input {
    width: 21rem;
    height: 1.75rem;
    margin: 2rem 0 2.5rem 0;
    padding: 1rem 2rem;
    color: ${(props) => props.theme.colors.text};
    background-color: ${(props) => props.theme.colors.background + "3F"};
    border: none;
    border-radius: 0.5rem;
  }
  input:focus {
    outline: solid 1px ${(props) => props.theme.colors.primary};
  }
  .category,
  .difficulty {
    .desc {
      font-size: 1.5rem;
    }
    .buttons {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 1.25rem;
      margin: 1.5rem 0 3rem 0;
    }
  }
`;

export default SignInPage;

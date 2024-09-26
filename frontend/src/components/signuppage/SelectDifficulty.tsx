import Button from "@components/Button";
import signupState from "@store/signupState";
import { useRecoilState } from "recoil";

const SelectDifficulty = () => {
  const [signupData, setSignupData] = useRecoilState(signupState);
  const selectedDifficulty = signupData.difficulty;
  const difficulties = [
    { id: 1, difficulty: "초급" },
    { id: 2, difficulty: "중급" },
    { id: 3, difficulty: "고급" },
  ];

  const handleDifficultyClick = (difficulty: number) => {
    setSignupData({ ...signupData, difficulty });
  };

  return (
    <div className="difficulty">
      <div className="desc">영어 실력</div>
      <div className="buttons">
        {difficulties.map((difficulty) => (
          <Button
            key={difficulty.difficulty}
            $varient={
              selectedDifficulty === difficulty.id ? "primary" : "cancel"
            }
            size={"medium"}
            onClick={() => handleDifficultyClick(difficulty.id)}
          >
            {difficulty.difficulty}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SelectDifficulty;

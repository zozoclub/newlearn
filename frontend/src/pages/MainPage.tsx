import Button from "@components/Button";
import { useTheme } from "@context/ThemeContext";

function MainPage() {
  const { toggleTheme } = useTheme();

  return (
    <div>
      <Button
        varient="primary"
        size="medium"
        onClick={() => console.log("Clicked!")}
      >
        안녕하세요
      </Button>
      <Button varient="cancel" size="medium" onClick={toggleTheme}>
        테마 전환
      </Button>
    </div>
  );
}

export default MainPage;

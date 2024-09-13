import { themeState } from "@store/themeState";
import { useSetRecoilState } from "recoil";

const DarkModeButton = () => {
  const setTheme = useSetRecoilState(themeState);

  const clickHandler = () => {
    setTheme((currentTheme) => {
      const newTheme = currentTheme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  };
  return (
    <div>
      <div onClick={clickHandler}>자폭버튼</div>
    </div>
  );
};

export default DarkModeButton;

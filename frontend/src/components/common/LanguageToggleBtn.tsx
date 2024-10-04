import languageState from "@store/languageState";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled, { css, keyframes } from "styled-components";

const LanguageToggleBtn = () => {
  const [languageData, setLanguageData] = useRecoilState(languageState);
  const [isAnimate, setIsAnimate] = useState<boolean>(false);
  const [selectedLang, setSelectedLang] = useState<string>(languageData);

  useEffect(() => {
    setIsAnimate(true);
    setTimeout(() => {
      setSelectedLang(languageData === "en" ? "A" : "한");
    }, 300);
    setTimeout(() => {
      setIsAnimate(false);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languageData]);

  return (
    <Container
      $selectedLanguage={languageData}
      $isAnimate={isAnimate}
      onClick={() => {
        setLanguageData(languageData === "kr" ? "en" : "kr");
      }}
    >
      <div
        className="lang-div"
        style={{
          transform: languageData === "kr" ? "rotateY(180deg)" : "rotateY(0)",
        }}
      >
        {selectedLang}
      </div>
    </Container>
  );
};

const Container = styled.div<{
  $selectedLanguage: "kr" | "en";
  $isAnimate: boolean;
}>`
  display: grid;
  place-items: center;
  position: fixed;
  bottom: 3rem;
  width: 3rem;
  height: 3rem;
  border-radius: 100%;
  color: #ffffff;
  background-color: ${(props) => props.theme.colors.primary};
  transform: rotateY(
    ${(props) => (props.$selectedLanguage === "kr" ? "180deg" : 0)}
  );
  transition: transform 0.5s, background-color 0.5s;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }

  .lang-div {
    ${(props) =>
      props.$isAnimate &&
      css`
        animation: ${RotateAnimate} 0.5s;
      `}
    transition: transform 0.5s;
  }
`;

const RotateAnimate = keyframes`
  0% {
        opacity: 1;
      }
      50% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
`;

export default LanguageToggleBtn;

import languageState from "@store/languageState";
import locationState from "@store/locationState";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled, { css, keyframes } from "styled-components";

const LanguageToggleBtn = () => {
  const [languageData, setLanguageData] = useRecoilState(languageState);
  const [isAnimate, setIsAnimate] = useState<boolean>(false);
  const [selectedLang, setSelectedLang] = useState<string>(languageData);
  const currentLocationData = useRecoilValue(locationState);

  useEffect(() => {
    setIsAnimate(true);
    setTimeout(() => {
      setSelectedLang(languageData === "en" ? "A" : "한");
    }, 300);
    setTimeout(() => {
      setIsAnimate(false);
    }, 500);
  }, [languageData]);

  if (
    currentLocationData === "login" ||
    currentLocationData === "signUp" ||
    currentLocationData === "notFound" ||
    currentLocationData === "myPage" ||
    currentLocationData === "search"
  )
    return null;

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
  z-index: 1;
  bottom: 3rem;
  width: 4rem;
  height: 4rem;
  border-radius: 100%;
  color: #ffffff;
  background-color: ${(props) => props.theme.colors.primary};
  transform: rotateY(
    ${(props) => (props.$selectedLanguage === "kr" ? "180deg" : 0)}
  );
  box-shadow: ${(props) =>
    props.$selectedLanguage === "kr"
      ? "-0.25rem 0.25rem 0.25rem #000000BD"
      : "0.25rem 0.25rem 0.25rem #000000BD"};
  transition: box-shadow 0.5s, transform 0.5s, background-color 0.5s;
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

  @media screen and (max-width: 767px) {
    right: 3rem;
    bottom: 6rem;
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

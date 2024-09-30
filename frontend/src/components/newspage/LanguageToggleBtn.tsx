import languageState from "@store/languageState";
import { useRecoilState } from "recoil";
import styled from "styled-components";

const LanguageToggleBtn = () => {
  const [languageData, setLanguageData] = useRecoilState(languageState);
  return (
    <Container
      onClick={() => setLanguageData(languageData === "kr" ? "en" : "kr")}
    >
      <EngDiv>A</EngDiv>
      <KorDiv>한</KorDiv>
      <SelectedDiv $selectedLanguage={languageData} />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  position: relative;
  width: 5rem;
  height: 2rem;
  background-color: ${(props) => props.theme.colors.readonly};
  border-radius: 0.75rem;
  cursor: pointer;
`;

const ToggleItem = styled.div`
  position: absolute;
  z-index: 2;
  width: 2.5rem;
  height: 2rem;
  line-height: 2rem;
  text-align: center;
`;

const EngDiv = styled(ToggleItem)`
  left: 0;
`;

const KorDiv = styled(ToggleItem)`
  left: 50%;
`;

const SelectedDiv = styled.div<{ $selectedLanguage: "kr" | "en" }>`
  position: absolute;
  z-index: 1;
  top: 0;
  transform: translateX(
    ${(props) => (props.$selectedLanguage === "kr" ? "2.5rem" : 0)}
  );
  width: 2.5rem;
  height: 100%;
  transition: transform 0.5s;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 0.75rem;
`;

export default LanguageToggleBtn;

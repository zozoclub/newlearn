import { RecoilRoot } from "recoil";
import { ThemeProvider } from "@context/ThemeContext";
import { GlobalStyle } from "@styles/GlobalStyle";
import MainPage from "@pages/MainPage";
import styled from "styled-components";
import Background from "@styles/BackGround";

const AppContainer = styled.div`
  position: relative;
  background-color: none;
`;

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <ThemeProvider>
        <GlobalStyle />
        <AppContainer>
          <Background />
          <MainPage />
        </AppContainer>
      </ThemeProvider>
    </RecoilRoot>
  );
};

export default App;

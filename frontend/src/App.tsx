import { RecoilRoot } from "recoil";
import styled from "styled-components";
import { ThemeProvider } from "@context/ThemeContext";
import MainPage from "@pages/MainPage";
import { GlobalStyle } from "@styles/GlobalStyle";

const AppContainer = styled.div`
  background-image: url(${(props) => props.theme.images.background});
  /* background-image: url("src/assets/images/background-dark.png"); */
  color: ${(props) => props.theme.colors.text};
  min-height: 100vh;
`;

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <ThemeProvider>
        <GlobalStyle />
        <AppContainer>
          <MainPage />
        </AppContainer>
      </ThemeProvider>
    </RecoilRoot>
  );
};

export default App;

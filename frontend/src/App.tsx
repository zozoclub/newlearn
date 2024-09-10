import { RecoilRoot } from "recoil";
import { ThemeProvider } from "./context/ThemeContext";
import styled from "styled-components";
import MainPage from "./pages/MainPage";
import { GlobalStyle } from "@styles/GlobalStyle";

const AppContainer = styled.div`
  background-color: ${(props) => props.theme.colors.background};
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

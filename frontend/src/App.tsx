import styled, { ThemeProvider } from "styled-components";
import { useRecoilValue } from "recoil";
import { Outlet } from "react-router-dom";

import Header from "@components/Header";
import Navbar from "@components/Navbar";
import Background from "@styles/BackGround";
import { GlobalStyle } from "@styles/GlobalStyle";
import { themeState } from "@store/themeState";
import { darkTheme } from "@styles/theme/darkTheme";
import { lightTheme } from "@styles/theme/lightTheme";
import TransitionContent from "@components/TransitionContent";

const AppContainer = styled.div`
  position: relative;
  height: 100vh;
  padding: 0 5vw;
`;

const App: React.FC = () => {
  const theme = useRecoilValue(themeState) === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Background />
      <AppContainer>
        <Header />
        <TransitionContent>
          <Outlet />
        </TransitionContent>
        <Navbar />
      </AppContainer>
    </ThemeProvider>
  );
};

export default App;

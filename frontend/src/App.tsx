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
import { useEffect } from "react";
import navbarState from "@store/navbarStats";

const App: React.FC = () => {
  const theme = useRecoilValue(themeState) === "dark" ? darkTheme : lightTheme;
  const navbar = useRecoilValue(navbarState);
  useEffect(() => {
    console.log(
      " _   _                       _                               \n\
| \\ | |                     | |                              \n\
|  \\| |  ___ __      __ ___ | |      ___   __ _  _ __  _ __  \n\
| . ` | / _ \\\\ \\ /\\ / // __|| |     / _ \\ / _` || '__|| '_ \\ \n\
| |\\  ||  __/ \\ V  V / \\__ \\| |____|  __/| (_| || |   | | | |\n\
\\_| \\_/ \\___|  \\_/\\_/  |___/\\_____/ \\___| \\__,_||_|   |_| |_\n\
                                                             \n\
Welcome To NewsLearn!"
    );
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Background />
      <AppContainer>
        <Header />
        <TransitionContent>
          <Outlet />
        </TransitionContent>
        {navbar && <Navbar />}
      </AppContainer>
    </ThemeProvider>
  );
};

const AppContainer = styled.div`
  position: relative;
  width: 90vw;
  padding: 0 calc(5vw - 0.1875rem);
`;

export default App;

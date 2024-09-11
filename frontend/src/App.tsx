import { RecoilRoot } from "recoil";
import styled from "styled-components";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router";

import { ThemeProvider } from "@context/ThemeContext";
import { GlobalStyle } from "@styles/GlobalStyle";
import Background from "@styles/BackGround";

const AppContainer = styled.div`
  position: relative;
`;

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <ThemeProvider>
        <GlobalStyle />
        <AppContainer>
          어이가없네
          <Background />
          <RouterProvider router={router} />
        </AppContainer>
      </ThemeProvider>
    </RecoilRoot>
  );
};

export default App;

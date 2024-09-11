import { RecoilRoot } from "recoil";
import { ThemeProvider } from "@context/ThemeContext";
import { GlobalStyle } from "@styles/GlobalStyle";
import styled from "styled-components";
import Background from "@styles/BackGround";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router";

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
          <RouterProvider router={router} />
        </AppContainer>
      </ThemeProvider>
    </RecoilRoot>
  );
};

export default App;

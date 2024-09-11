import { RecoilRoot } from "recoil";
import { ThemeProvider } from "./context/ThemeContext";
import styled from "styled-components";
import { GlobalStyle } from "@styles/GlobalStyle";

import { RouterProvider } from "react-router-dom";
import { router } from "./Router";

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
          <RouterProvider router={router} />
        </AppContainer>
      </ThemeProvider>
    </RecoilRoot>
  );
};

export default App;

import { RecoilRoot } from "recoil";
import styled from "styled-components";
import { ThemeProvider } from "@context/ThemeContext";
import { GlobalStyle } from "@styles/GlobalStyle";

import { RouterProvider } from "react-router-dom";
import { router } from "./Router";

const AppContainer = styled.div`
  background-image: url(${(props) => props.theme.images.background});
  background-attachment: fixed;
  background-repeat: no-repeat;
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

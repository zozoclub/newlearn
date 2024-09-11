import { RecoilRoot } from "recoil";
import { ThemeProvider } from "@context/ThemeContext";
import { GlobalStyle } from "@styles/GlobalStyle";

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <ThemeProvider>
        <GlobalStyle />
        <MainPage />
      </ThemeProvider>
    </RecoilRoot>
  );
};

export default App;

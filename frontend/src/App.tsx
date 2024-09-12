import { Outlet } from "react-router-dom";
import styled from "styled-components";

import Header from "@components/Header";
import Navbar from "@components/Navbar";

const AppContainer = styled.div`
  position: relative;
  height: 100vh;
  padding: 0 5vw;
`;

const Content = styled.div`
  height: calc(100% - 150px);
`;

const App: React.FC = () => {
  return (
    <AppContainer>
      <Header />
      <Content>
        <Outlet />
      </Content>
      <Navbar />
    </AppContainer>
  );
};

export default App;

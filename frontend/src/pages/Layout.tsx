import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

import Navbar from "@components/Navbar";
import Header from "@components/Header";

const Container = styled.div`
  position: relative;
  height: 100vh;
  padding: 0 5vw;
`;

const Content = styled.div`
  height: calc(100%-150px);
`;

const Layout: React.FC = () => {
  return (
    <Container>
      <Header />
      <Content>
        <Outlet />
      </Content>
      <Navbar />
    </Container>
  );
};

export default Layout;

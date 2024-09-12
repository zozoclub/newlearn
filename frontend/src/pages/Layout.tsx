import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

import Navbar from "@components/Navbar";
import Header from "@components/Header";

const Container = styled.div`
  padding: 0 125px;
`;

const Content = styled.div``;

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

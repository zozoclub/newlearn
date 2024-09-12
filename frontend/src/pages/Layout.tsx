import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

import Navbar from "@components/Navbar";
import LogoImage from "@assets/images/logo-full.png";

const Container = styled.div``;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100px;
`;

const Logo = styled.img.attrs({
  src: `${LogoImage}`,
  alt: "LogoImage",
})`
  width: 310px;
  height: 67px;
`;

const PageInfo = styled.div`
  font-size: 2rem;
  font-weight: 600;
`;

const ContentContainer = styled.div``;

const Layout: React.FC = () => {
  return (
    <Container>
      <HeaderContainer>
        <Logo />
        <PageInfo>어디 페이지죠 이게</PageInfo>
      </HeaderContainer>
      <ContentContainer>
        <Outlet />
      </ContentContainer>
      <Navbar />
    </Container>
  );
};

export default Layout;

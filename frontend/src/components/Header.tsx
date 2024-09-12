import styled from "styled-components";
import { useRecoilValue } from "recoil";

import LogoImage from "@assets/images/logo-full.png";
import locationState from "@store/state";
import Button from "@components/Button";
import { useTheme } from "@context/ThemeContext";

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 150px;
  padding: 0 100px;
`;

const Logo = styled.img.attrs({
  src: `${LogoImage}`,
  alt: "LogoImage",
})`
  width: 275px;
  height: 60px;
`;

const PageInfo = styled.div`
  font-size: 2rem;
  font-weight: 600;
`;

const Header = () => {
  const currentLocation = useRecoilValue(locationState);
  const { toggleTheme } = useTheme();

  return (
    <HeaderContainer>
      {/* NotFoundPage일 때 Logo 표시 안 함 */}
      {currentLocation !== "" && <Logo />}

      {/* 테마 전환 버튼 나중에 따로 만들 예정 */}
      <Button $varient="cancel" size="medium" onClick={toggleTheme}>
        테마 전환(임시)
      </Button>

      <PageInfo>{currentLocation}</PageInfo>
    </HeaderContainer>
  );
};

export default Header;

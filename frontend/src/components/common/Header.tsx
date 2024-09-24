import styled from "styled-components";
import { useRecoilValue } from "recoil";

import LogoImage from "@assets/images/logo-full.png";
import locationState from "@store/locationState";
import DarkModeButton from "@components/common/DarkModeButton";
import { usePageTransition } from "@hooks/usePageTransition";
import UserProfile from "@components/common/UserProfile";

const Header = () => {
  const currentLocation = useRecoilValue(locationState);
  const transitionTo = usePageTransition();

  return (
    <HeaderContainer $currentLocation={currentLocation}>
      {/* NotFoundPage일 때 Logo 표시 안 함 */}
      {currentLocation !== "" && (
        <Logo
          onClick={() => {
            transitionTo("/");
          }}
        />
      )}
      <div className="right-side">
        <PageInfo>{currentLocation}</PageInfo>
        {/* 페이지 정보 없을 때 유저 프로필 표시 안 함 */}
        {currentLocation !== "" && <UserProfile />}
        <DarkModeButton />
      </div>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div<{ $currentLocation: string }>`
  display: flex;
  position: relative;
  justify-content: ${(props) =>
    props.$currentLocation ? "space-between" : "end"};
  align-items: center;
  height: 9.375rem;
  .right-side {
    display: flex;
    align-items: center;
  }
`;

const Logo = styled.img.attrs({
  src: `${LogoImage}`,
  alt: "LogoImage",
})`
  width: 17.5rem;
  height: 3.75rem;
  cursor: pointer;
`;

const PageInfo = styled.div`
  margin-right: 1rem;
  font-family: "Righteous";
  font-size: 2rem;
`;

export default Header;

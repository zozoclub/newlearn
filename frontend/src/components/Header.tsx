import styled from "styled-components";
import { useRecoilValue } from "recoil";

import LogoImage from "@assets/images/logo-full.png";
import locationState from "@store/locationState";
import DarkModeButton from "./DarkModeButton";
import { usePageTransition } from "@hooks/usePageTransition";
import UserProfile from "./UserProfile";

const Header = () => {
  const currentLocation = useRecoilValue(locationState);
  const transitionTo = usePageTransition();

  return (
    <HeaderContainer>
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
        <UserProfile />
        <DarkModeButton />
      </div>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div`
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  height: 9.375rem;
  padding: 0 2.5%;
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

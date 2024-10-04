import styled from "styled-components";
import { useRecoilValue } from "recoil";

import locationState from "@store/locationState";
import DarkModeButton from "@components/common/DarkModeButton";
import { usePageTransition } from "@hooks/usePageTransition";
import UserProfile from "@components/common/UserProfile";
import FullLogo from "./FullLogo";

const Header = () => {
  const currentLocation = useRecoilValue(locationState);
  const transitionTo = usePageTransition();
  const hiddenPages = ["login", "signUp", "notFound"];

  return (
    <HeaderContainer $currentLocation={currentLocation}>
      {/* 페이지 정보 없을 때 Logo 표시 안 함 */}
      {!hiddenPages.includes(currentLocation) && (
        <Logo
          onClick={() => {
            transitionTo("/");
          }}
        >
          <FullLogo width={280} height={60} />
        </Logo>
      )}
      <div className="right-side">
        {!hiddenPages.includes(currentLocation) && (
          <>
            {/* 페이지 정보 없을 때 유저 프로필 표시 안 함 */}
            <UserProfile />
          </>
        )}
        <DarkModeButton />
      </div>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div<{ $currentLocation: string }>`
  display: flex;
  position: relative;
  justify-content: ${(props) =>
    props.$currentLocation !== "login" && props.$currentLocation !== "notFound"
      ? "space-between"
      : "end"};
  align-items: center;
  height: 9.375rem;
  padding: 0 5%;
  .right-side {
    display: flex;
    align-items: center;
  }
  @media (max-width: ${(props) => props.theme.size.mobile}) {
    display: none;
  }
`;

const Logo = styled.div`
  width: 17.5rem;
  height: 3.75rem;
  cursor: pointer;
`;

export default Header;

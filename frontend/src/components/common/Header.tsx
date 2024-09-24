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

  return (
    <HeaderContainer $currentLocation={currentLocation}>
      {/* 페이지 정보 없을 때 Logo 표시 안 함 */}
      {currentLocation !== "login" && currentLocation !== "" && (
        <Logo
          onClick={() => {
            transitionTo("/");
          }}
        >
          <FullLogo width={360} height={60} />
        </Logo>
      )}
      <div className="right-side">
        {currentLocation !== "login" && currentLocation !== "" && (
          <>
            {/* 메인 페이지에서 페이지 정보 표시 안 함 */}
            {currentLocation !== "main" && (
              <PageInfo>{currentLocation}</PageInfo>
            )}
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
    props.$currentLocation !== "login" && props.$currentLocation !== ""
      ? "space-between"
      : "end"};
  align-items: center;
  height: 9.375rem;
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

const PageInfo = styled.div`
  margin-right: 1rem;
  font-family: "Righteous";
  font-size: 2rem;
`;

export default Header;

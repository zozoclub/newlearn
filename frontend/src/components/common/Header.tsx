import styled from "styled-components";
import { useRecoilValue } from "recoil";

import locationState from "@store/locationState";
import DarkModeButton from "@components/common/DarkModeButton";
import { usePageTransition } from "@hooks/usePageTransition";
import UserProfile from "@components/common/UserProfile";
import FullLogo from "./FullLogo";
import { useEffect, useState } from "react";
import NewsListHeader from "@components/NewsListPage/NewsListHeader";

const Header = () => {
  const currentLocation = useRecoilValue(locationState);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isNewsPage, setIsNewspage] = useState<boolean>(false);
  const transitionTo = usePageTransition();
  const hiddenPages = ["login", "signUp", "notFound"];

  useEffect(() => {
    const isPublicPage = hiddenPages.includes(currentLocation);
    setIsVisible(!isPublicPage);
    setIsNewspage(currentLocation === "newsList");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation]);

  return (
    <HeaderContainer $isVisible={isVisible} $isNewsPage={isNewsPage}>
      {/* 페이지 정보 없을 때 Logo 표시 안 함 */}
      {isVisible && (
        <Logo
          onClick={() => {
            transitionTo("/");
          }}
        >
          <FullLogo width={280} height={60} />
        </Logo>
      )}
      {isNewsPage && <NewsListHeader />}
      <div className="right-side">
        {isVisible && (
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

const HeaderContainer = styled.div<{
  $isVisible: boolean;
  $isNewsPage: boolean;
}>`
  display: flex;
  position: relative;
  justify-content: ${(props) => (props.$isVisible ? "space-between" : "end")};
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
  @media (max-width: 1279px) {
    margin-bottom: ${(props) => (props.$isNewsPage ? "5rem" : "0")};
  }
`;

const Logo = styled.div`
  width: 17.5rem;
  height: 3.75rem;
  cursor: pointer;
`;

export default Header;

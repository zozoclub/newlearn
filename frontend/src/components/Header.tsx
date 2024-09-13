import styled from "styled-components";
import { useRecoilValue } from "recoil";

import LogoImage from "@assets/images/logo-full.png";
import locationState from "@store/locationState";
import { useNavigate } from "react-router-dom";
import DarkModeButton from "./DarkModeButton";

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 150px;
  padding: 0 5vw;
`;

const Logo = styled.img.attrs({
  src: `${LogoImage}`,
  alt: "LogoImage",
})`
  width: 275px;
  height: 60px;
  cursor: pointer;
`;

const PageInfo = styled.div`
  font-size: 2rem;
  font-weight: 600;
`;

const Header = () => {
  const navigate = useNavigate();
  const currentLocation = useRecoilValue(locationState);

  return (
    <HeaderContainer>
      {/* NotFoundPage일 때 Logo 표시 안 함 */}
      {currentLocation !== "" && (
        <Logo
          onClick={() => {
            navigate("/");
          }}
        />
      )}
      <DarkModeButton />
      <PageInfo>{currentLocation}</PageInfo>
    </HeaderContainer>
  );
};

export default Header;

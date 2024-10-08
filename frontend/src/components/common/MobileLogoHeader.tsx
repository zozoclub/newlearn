import FullLogo from "@components/common/FullLogo";
import newsSearchIcon from "@assets/icons/searchIcon.svg";
import DarkModeButton from "@components/common/DarkModeButton";
import styled from "styled-components";
import { usePageTransition } from "@hooks/usePageTransition";

const MobileLogoHeader = () => {
  const transitionTo = usePageTransition();

  const clickLogoHandle = () => {
    transitionTo("/");
  };

  return (
    <>
      <div style={{ height: "70px" }}></div>
      <MobileMainHeader>
        <div onClick={clickLogoHandle} style={{ cursor: "pointer" }}>
          <FullLogo height={70} width={200} />
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginBottom: "0.25rem", transform: "scale(0.8)" }}>
            <DarkModeButton />
          </div>
          <img height={30} src={newsSearchIcon} />
        </div>
      </MobileMainHeader>
    </>
  );
};

export default MobileLogoHeader;

const MobileMainHeader = styled.div`
  width: calc(100% - 1.5rem);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  height: 70px;
  padding: 0 1.5rem 0 0;
  background-color: ${(props) => props.theme.colors.cardBackground};
`;

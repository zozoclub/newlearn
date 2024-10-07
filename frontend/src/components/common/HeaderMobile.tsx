import React from "react";
import backArrowIcon from "@assets/icons/mobile/backArrowIcon.svg";
import styled from "styled-components";
import useBackPage from "@hooks/useBackPage";
import { usePageTransition } from "@hooks/usePageTransition";

type Props = {
  title?: string;
  url?: string;
};

const HeaderMobile: React.FC<Props> = ({ title, url }) => {
  const back = useBackPage();
  const transitionTo = usePageTransition();

  const handleClick = () => {
    if (url) {
      transitionTo(url);
    } else {
      back();
    }
  };
  return (
    <ModalHeader>
      <BackButton onClick={handleClick}>
        <img src={backArrowIcon} alt="버튼" />
      </BackButton>
      <ModalTitle>{title}</ModalTitle>
    </ModalHeader>
  );
};

export default HeaderMobile;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  position: sticky;
  top: 0;
  background-color: ${(props) => props.theme.colors.background};
  z-index: 1001;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
`;

const ModalTitle = styled.h2`
  margin: 0;
  margin-left: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
`;

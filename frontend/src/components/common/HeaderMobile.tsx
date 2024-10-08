import React from "react";
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
    <MobileHeader>
      <BackButton onClick={handleClick}>
        <ArrowIcon viewBox="0 0 12 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.3789 18.145L9.7874 19.735L1.1189 11.0695C0.979172 10.9306 0.868279 10.7655 0.792607 10.5837C0.716935 10.4018 0.677979 10.2067 0.677979 10.0097C0.677979 9.81276 0.716935 9.61771 0.792607 9.43584C0.868279 9.25396 0.979172 9.08885 1.1189 8.95L9.7874 0.279999L11.3774 1.87L3.2414 10.0075L11.3789 18.145Z" />
        </ArrowIcon>
      </BackButton>
      <ModalTitle>{title}</ModalTitle>
    </MobileHeader>
  );
};

export default HeaderMobile;

const MobileHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  position: sticky;
  top: 0;
  background-color: ${(props) => props.theme.colors.cardBackground};
  z-index: 1001;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  padding: 1rem 0.5rem 0.75rem;
  cursor: pointer;
`;

const ModalTitle = styled.h2`
  margin: 0;
  margin-left: 0.5rem;
  font-size: 1.25rem;
  font-weight: bold;
`;

const ArrowIcon = styled.svg`
  width: 12px;
  height: 20px;
  fill: ${(props) => props.theme.colors.text};
  transition: fill 0.3s ease;
`;

import React from "react";
import styled from "styled-components";

type ButtonProps = {
  $varient: "primary" | "cancel";
  size: "small" | "medium" | "large";
  children: React.ReactNode;
  onClick: () => void;
};

const Button: React.FC<ButtonProps> = ({
  children,
  $varient = "primary",
  size = "medium",
  onClick,
}) => {
  return (
    <StyledButton $varient={$varient} size={size} onClick={onClick}>
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button<ButtonProps>`
  width: ${(props) => props.size === "large" && "25rem"};
  padding: ${(props) => {
    switch (props.size) {
      case "small":
        return "0.25rem 0.5rem";
      case "large":
        return "1rem 1.5rem";
      default:
        return "1rem 1rem";
    }
  }};
  background-color: ${(props) =>
    props.$varient === "primary"
      ? props.theme.colors.primary
      : props.theme.colors.cancel};
  color: ${(props) => props.$varient === "primary" && "#ffffff"};
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.5s;
`;

export default Button;

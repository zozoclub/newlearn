import React from "react";
import styled from "styled-components";
import { Theme } from "types/theme";

type ButtonProps = {
  $varient: "primary" | "cancel";
  size: "small" | "medium" | "large";
  children: React.ReactNode;
  onClick: () => void;
};

const StyledButton = styled.button<ButtonProps & { theme: Theme }>`
  background-color: ${(props) =>
    props.$varient === "primary"
      ? props.theme.colors.primary
      : props.theme.colors.cancel};
  color: ${(props) => props.$varient === "primary" && "#ffffff"};
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  padding: ${(props) => {
    switch (props.size) {
      case "small":
        return "0.25rem 0.5rem";
      case "large":
        return "0.75rem 1.5rem";
      default:
        return "0.5rem 1rem";
    }
  }};
  font-size: ${(props) => {
    switch (props.size) {
      case "small":
        return "0.8rem";
      case "large":
        return "1.2rem";
      default:
        return "1rem";
    }
  }};
`;

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

export default Button;

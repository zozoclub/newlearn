import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export const GlobalStyle = createGlobalStyle`
  ${reset}
  body {
    font-family: 'Pretendard', sans-serif;
    color: ${(props) => props.theme.colors.text};
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export const GlobalStyle = createGlobalStyle`
  ${reset}
/* 폰트 전역 Pretendard 설정 */
  * {
    font-family: 'Pretendard', sans-serif;
    color: ${(props) => props.theme.colors.text};
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    }
`;

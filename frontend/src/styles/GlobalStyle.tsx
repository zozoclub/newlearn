import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
/* 폰트 전역 Pretendard 설정 */
  * {
    font-family: 'Pretendard', sans-serif;
  }
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

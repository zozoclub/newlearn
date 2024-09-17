import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export const GlobalStyle = createGlobalStyle`
  ${reset}
  body, button {
    margin: 0;
    padding: 0;
    color: ${(props) => props.theme.colors.text};
    font-family: 'Pretendard', sans-serif;
    box-sizing: border-box;
  }
  /* 스크롤바 커스터마이징 */
  :root {
    ::-webkit-scrollbar {
      background-color: ${(props) =>
        props.theme.colors.cardBackground}; /* 스크롤바 트랙(배경) 색상 */
      width: 0.375rem;  /* 스크롤바 너비 */
      height: 0.375rem; /* 가로 스크롤바 높이 */
    }

    ::-webkit-scrollbar-thumb {
      background-color: ${(props) =>
        props.theme.colors.primary}; /* 스크롤바 색상 */
      border-radius: 0.75rem; /* 스크롤바 모서리 둥글게 */
      border: none;
    }

    ::-webkit-scrollbar-track {
      background-color: ${(props) =>
        props.theme.colors.cardBackground}; /* 스크롤바 트랙(배경) 색상 */
      border-radius: 0.75rem; /* 스크롤바 트랙 모서리 둥글게 */
    }
  }
`;

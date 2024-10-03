import styled from "styled-components";

const Bookmark: React.FC<{
  isScrapped: boolean;
}> = ({ isScrapped }) => {
  return (
    <>
      <svg
        width="20"
        height="32"
        viewBox="0 0 25 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Path
          $isScrapped={isScrapped}
          d="M12.6962 26.2068L12.5 26.1231L12.3038 26.2068L0.5 31.2431V3.55556C0.5 1.87824 1.88118 0.5 3.57143 0.5H21.4286C23.1188 0.5 24.5 1.87824 24.5 3.55556V31.2431L12.6962 26.2068Z"
        />
      </svg>
    </>
  );
};

const Path = styled.path<{ $isScrapped: boolean }>`
  fill: ${(props) =>
    props.$isScrapped ? props.theme.colors.primary : "transparent"};
  stroke: ${(props) => props.theme.colors.text};
  cursor: pointer;
`;

export default Bookmark;

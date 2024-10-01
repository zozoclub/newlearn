import React from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 사용
import useBackPage from "@hooks/useBackPage";
import { useTheme } from "styled-components";

type BackArrowProps = {
  width: number;
  height: number;
  url?: string; 
};

const BackArrow: React.FC<BackArrowProps> = ({ width, height, url }) => {
  const back = useBackPage();
  const navigate = useNavigate();
  const theme = useTheme();

  // 조건을 추가하여 back으로 갈지 원하는 url로 갈지 추가할 수 있음
  const handleClick = () => {
    if (url) {
      navigate(url);
    } else {
      back();
    }
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={handleClick} // onClick에서 handleClick 호출
      style={{ cursor: "pointer" }}
    >
      <g clipPath="url(#clip0_100_794)">
        <path
          d="M84 44H27.32L41.64 29.64L36 24L12 48L36 72L41.64 66.36L27.32 52H84V44Z"
          fill={theme.colors.text}
        />
      </g>
      <defs>
        <clipPath id="clip0_100_794">
          <rect width="96" height="96" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default BackArrow;

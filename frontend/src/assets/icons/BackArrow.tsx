import React from "react";
import useBackPage from "@hooks/useBackPage";

import { useTheme } from "styled-components";

const BackArrow: React.FC = () => {
  const back = useBackPage();
  const theme = useTheme();
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={back}
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

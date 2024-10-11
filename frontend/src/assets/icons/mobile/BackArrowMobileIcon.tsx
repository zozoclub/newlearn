import React from "react";
import useBackPage from "@hooks/useBackPage";
import { usePageTransition } from "@hooks/usePageTransition";

type BackArrowProps = {
  url?: string;
};

const BackArrowMobileIcon: React.FC<BackArrowProps> = ({ url }) => {
  const back = useBackPage();
  const transitionTo = usePageTransition();

  // 조건을 추가하여 back으로 갈지 원하는 url로 갈지 추가할 수 있음
  const handleClick = () => {
    if (url) {
      transitionTo(url);
    } else {
      back();
    }
  };

  return (
    <svg
      width="12"
      height="20"
      viewBox="0 0 12 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={handleClick} // onClick에서 handleClick 호출
      style={{ cursor: "pointer" }}
    >
      <path
        d="M11.3789 18.145L9.7874 19.735L1.1189 11.0695C0.979172 10.9306 0.868279 10.7655 0.792607 10.5837C0.716935 10.4018 0.677979 10.2067 0.677979 10.0097C0.677979 9.81276 0.716935 9.61771 0.792607 9.43584C0.868279 9.25396 0.979172 9.08885 1.1189 8.95L9.7874 0.279999L11.3774 1.87L3.2414 10.0075L11.3789 18.145Z"
        fill="gray"
      />
    </svg>
  );
};

export default BackArrowMobileIcon;

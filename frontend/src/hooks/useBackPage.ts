import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

// 콜백함수로 구현했습니다
const useBackPage = () => {
  const navigate = useNavigate();

  const goBack = useCallback(() => {
    navigate(-1); // 뒤로 가기
  }, [navigate]);

  return goBack;
};

export default useBackPage;

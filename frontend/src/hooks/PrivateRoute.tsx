import { getOAuthAccessToken } from "@services/userService";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import loginState from "@store/loginState";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { getRefreshToken } from "@services/axiosInstance";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const PrivateRoute = () => {
  const query = useQuery();
  const [isLoading, setIsLoading] = useState(true);
  const isLogin = useRecoilValue(loginState);
  const setLoginState = useSetRecoilState(loginState);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      // session에 accessToken이 존재하면 로그인이 된 것으로 간주
      const storedToken = sessionStorage.getItem("accessToken");
      if (storedToken) {
        setLoginState(true);
        setIsLoading(false);
        return;
      }

      // 소셜 로그인 후 main 페이지로 이동할 때
      // 발급 받은 code로 로그인 정보를 가져옴
      const queryCode = query.get("code");
      if (queryCode) {
        try {
          const response = await getOAuthAccessToken(queryCode);
          console.log(response);
          if (response && response.accessToken) {
            sessionStorage.setItem("accessToken", response.accessToken);
            setLoginState(true);
            navigate("/", { replace: true });
          }
        } catch (error) {
          console.log(error);
          setLoginState(false);
        }
      }
      // 세션에 accessToken 정보가 없고 소셜 로그인 후가 아니라면 쿠키에 refreshToken으로 accessToken 재발급
      else {
        try {
          await getRefreshToken();
        } catch {
          setLoginState(false);
          setIsLoading(false);
        }
      }

      setIsLoading(false);
    };

    checkAuthentication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isLogin ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;

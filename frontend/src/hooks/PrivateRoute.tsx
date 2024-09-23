import { getOAuthAccessToken } from "@services/userService";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import loginState from "@store/loginState";
import { useRecoilValue, useSetRecoilState } from "recoil";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const PrivateRoute = () => {
  const query = useQuery();
  const [isLoading, setIsLoading] = useState(true);
  const isLogin = useRecoilValue(loginState);
  const setLoginState = useSetRecoilState(loginState);

  useEffect(() => {
    const checkAuthentication = async () => {
      const storedToken = sessionStorage.getItem("accessToken");
      if (storedToken) {
        setLoginState(true);
        setIsLoading(false);
        return;
      }

      const queryCode = query.get("code");

      if (queryCode) {
        try {
          const response = await getOAuthAccessToken(queryCode);
          console.log(response);
          if (response && response.accessToken) {
            sessionStorage.setItem("accessToken", response.accessToken);
            setLoginState(true);
          }
        } catch (error) {
          console.log(error);
          setLoginState(false);
        }
      }

      setIsLoading(false);
    };

    checkAuthentication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    // You can replace this with a loading spinner or component
    return <div>Loading...</div>;
  }

  return isLogin ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;

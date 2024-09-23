import { getOAuthAccessToken } from "@services/userService";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { usePageTransition } from "./usePageTransition";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const PrivateRoute = () => {
  const query = useQuery();
  const transitionTo = usePageTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      const storedToken = sessionStorage.getItem("accessToken");

      if (storedToken) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      const queryCode = query.get("code");

      if (queryCode) {
        try {
          const response = await getOAuthAccessToken(queryCode);
          console.log(response);
          // Assuming the response includes the access token
          // You might need to adjust this based on your API response structure
          if (response && response.accessToken) {
            sessionStorage.setItem("accessToken", response.accessToken);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.log(error);
          setIsAuthenticated(false);
        }
      }

      setIsLoading(false);
    };

    checkAuthentication();
  }, [query, transitionTo]);

  if (isLoading) {
    // You can replace this with a loading spinner or component
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;

import { Navigate, Outlet } from "react-router-dom";

const isLogin = sessionStorage.getItem("accessToken");

const PrivateRoute = () => {
  return isLogin ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;

import { Outlet, Navigate } from "react-router-dom";
import "../../styles/authLayout.css";
import { useSelector } from "react-redux";

export default function AuthLayout() {
  const { currentUser } = useSelector((state) => state.user);
  const userID = currentUser?.data?.user?._id ?? null;
  const isAuthenticated = !!userID;

  if (isAuthenticated) return <Navigate to="/" />;

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <Outlet />
      </div>
    </div>
  );
}

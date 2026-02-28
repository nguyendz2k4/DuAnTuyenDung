import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../utils/router";

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userStr = params.get("user");

    console.log("token:", token);
    console.log("userStr:", userStr);

    if (token) localStorage.setItem("token", token);
    if (userStr) localStorage.setItem("user", userStr);

    // về home
    navigate(ROUTES.USER.HOME, { replace: true });
  }, [navigate]);

  return <div style={{ padding: 20 }}>Đang đăng nhập...</div>;
}

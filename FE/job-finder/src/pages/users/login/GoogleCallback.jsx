import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../utils/router";

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userStr = params.get("user");

    if (token) localStorage.setItem("token", token);
    if (userStr) {
      const parsed = JSON.parse(decodeURIComponent(userStr));
      const normalized = {
        id: parsed.Id || parsed.id,
        full_name: parsed.FullName || parsed.full_name,
        email: parsed.Email || parsed.email,
        avatar: parsed.Avatar || parsed.avatar,
        role: parsed.Role || parsed.role,
      };
      localStorage.setItem("user", JSON.stringify(normalized));
    }

    navigate(ROUTES.USER.HOME, { replace: true });
  }, [navigate]);
  return <div style={{ padding: 20 }}>Đang đăng nhập...</div>;
}

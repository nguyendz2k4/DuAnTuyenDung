import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { ROUTES } from "../../../utils/router";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userStr = params.get("user");

    if (token && userStr) {
      try {
        const parsed = JSON.parse(decodeURIComponent(userStr));
        const normalized = {
          id: parsed.Id || parsed.id,
          full_name: parsed.FullName || parsed.full_name,
          email: parsed.Email || parsed.email,
          avatar: parsed.Avatar || parsed.avatar,
          role: parsed.Role || parsed.role,
        };
        // Dùng AuthContext thay vì ghi localStorage trực tiếp
        login(token, normalized);
      } catch (err) {
        console.error("Lỗi parse user data từ Google callback:", err);
      }
    }

    navigate(ROUTES.USER.HOME, { replace: true });
  }, [navigate, login]);

  return <div style={{ padding: 20 }}>Đang đăng nhập...</div>;
}

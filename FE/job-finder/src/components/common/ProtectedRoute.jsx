import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../utils/router";

/**
 * Component bảo vệ route - Redirect về login nếu chưa đăng nhập
 * Truyền location hiện tại qua state để sau khi login có thể redirect lại
 */
export default function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return (
            <Navigate
                to={ROUTES.USER.LOGIN}
                state={{ redirectTo: location.pathname }}
                replace
            />
        );
    }

    return children;
}

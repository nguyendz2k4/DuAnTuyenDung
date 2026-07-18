import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../utils/router";

/**
 * Component bảo vệ route - Redirect về login nếu chưa đăng nhập
 * Truyền location hiện tại qua state để sau khi login có thể redirect lại
 */
export default function ProtectedRoute({ children, allowedRoles }) {
    const { isAuthenticated, user } = useAuth();
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

    if (allowedRoles?.length) {
        const role = String(user?.role || user?.account_type || "").toLowerCase();
        const hasAccess = allowedRoles.some((allowedRole) => allowedRole.toLowerCase() === role);

        if (!hasAccess) {
            return <Navigate to={ROUTES.USER.HOME} replace />;
        }
    }

    return children;
}

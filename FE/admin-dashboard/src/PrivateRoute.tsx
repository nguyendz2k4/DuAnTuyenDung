import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "./context/AuthContext";

interface PrivateRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

export default function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) return <Navigate to="/signin" replace />;
    if (user && !allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />;

    return children;
}

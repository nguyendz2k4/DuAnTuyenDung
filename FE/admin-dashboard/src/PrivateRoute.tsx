import React from "react";
import { Navigate } from "react-router";

interface PrivateRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

export default function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
    const role = localStorage.getItem("role");

    if (!role) return <Navigate to="/signin" replace />;
    if (!allowedRoles.includes(role)) return <Navigate to="/unauthorized" replace />;

    return children;
}

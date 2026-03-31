import React from "react";
import { Navigate } from "react-router-dom";
import { isAdmin } from "../utils/auth";

export default function AdminRoute({ children }) {
    if (!isAdmin()) {
        return <Navigate to="/admin/login" replace />;
    }
    return children;
}

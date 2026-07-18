import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

/**
 * Hook để truy cập AuthContext từ bất kỳ component nào
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong AuthProvider");
  }
  return context;
};

/**
 * Provider quản lý toàn bộ trạng thái xác thực
 * - Đọc/ghi localStorage tập trung
 * - Cung cấp login/logout/updateUser cho tất cả components
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  const isAuthenticated = Boolean(token && user);

  // Đồng bộ state → localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  /**
   * Đăng nhập - Lưu token và user
   * @param {string} newToken - JWT token từ server
   * @param {object} userData - Thông tin user
   */
  const login = useCallback((newToken, userData) => {
    const normalizedUser = {
      ...userData,
      id: userData?.id || userData?.userId || userData?.user_id,
      full_name: userData?.full_name || userData?.fullName || userData?.name,
      role: userData?.role || userData?.accountType || userData?.account_type,
    };
    setToken(newToken);
    setUser(normalizedUser);
  }, []);

  /**
   * Đăng xuất - Xóa toàn bộ auth state
   */
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  /**
   * Cập nhật thông tin user (ví dụ: đổi avatar, tên)
   */
  const updateUser = useCallback((updatedData) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : null));
  }, []);

  const value = {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

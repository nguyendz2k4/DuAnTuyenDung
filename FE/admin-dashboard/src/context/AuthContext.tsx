import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// =============================================
// Auth Types
// =============================================

export interface AuthUser {
  userId: string;
  fullName: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
}

// =============================================
// Context
// =============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Hook để truy cập AuthContext từ bất kỳ component nào
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// =============================================
// Storage Keys — Giữ đồng nhất với SignIn hiện tại
// =============================================

const STORAGE_KEYS = {
  TOKEN: "token",
  USER_ID: "userId",
  ROLE: "role",
  EMAIL: "email",
  FULL_NAME: "fullName",
} as const;

/**
 * Đọc user info từ localStorage (chạy 1 lần khi mount)
 */
const loadUserFromStorage = (): { user: AuthUser | null; token: string | null } => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
  const role = localStorage.getItem(STORAGE_KEYS.ROLE);

  if (!token || !userId || !role) {
    return { user: null, token: null };
  }

  return {
    token,
    user: {
      userId,
      fullName: localStorage.getItem(STORAGE_KEYS.FULL_NAME) || "Guest",
      email: localStorage.getItem(STORAGE_KEYS.EMAIL) || "",
      role,
    },
  };
};

// =============================================
// Provider
// =============================================

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load từ localStorage khi component mount
  useEffect(() => {
    const stored = loadUserFromStorage();
    if (stored.token && stored.user) {
      setToken(stored.token);
      setUser(stored.user);
    }
  }, []);

  /**
   * Lưu session sau khi đăng nhập thành công
   */
  const login = useCallback((newToken: string, newUser: AuthUser) => {
    // Lưu vào localStorage
    localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
    localStorage.setItem(STORAGE_KEYS.USER_ID, newUser.userId);
    localStorage.setItem(STORAGE_KEYS.ROLE, newUser.role);
    localStorage.setItem(STORAGE_KEYS.EMAIL, newUser.email);
    localStorage.setItem(STORAGE_KEYS.FULL_NAME, newUser.fullName);

    // Cập nhật state
    setToken(newToken);
    setUser(newUser);
  }, []);

  /**
   * Xóa session khi đăng xuất
   */
  const logout = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    setToken(null);
    setUser(null);
  }, []);

  /**
   * Cập nhật thông tin user (ví dụ sau khi edit profile)
   */
  const updateUser = useCallback((updates: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };

      // Sync xuống localStorage
      if (updates.fullName) localStorage.setItem(STORAGE_KEYS.FULL_NAME, updates.fullName);
      if (updates.email) localStorage.setItem(STORAGE_KEYS.EMAIL, updates.email);
      if (updates.role) localStorage.setItem(STORAGE_KEYS.ROLE, updates.role);

      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

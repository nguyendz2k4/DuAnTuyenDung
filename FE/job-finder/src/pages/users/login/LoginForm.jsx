// LoginForm.jsx
import React, { useState } from "react";
import "./LoginForm.scss";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setLoading(true);
        setError("");

        try {
            // TODO: Thay đổi URL này thành API backend của bạn
            const response = await fetch("http://localhost/DuAnWebTuyenDung/BE/api/auth/login.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = '/';
            } else {
                setError(data.message || "Đăng nhập thất bại");
            }
        } catch (err) {
            setError("Có lỗi xảy ra khi đăng nhập");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = () => {
        const redirectBack = encodeURIComponent(window.location.origin);
        window.location.href =
            `http://localhost/DuAnWebTuyenDung/BE/api/auth/google.php?state_redirect=${redirectBack}`;
    };


    const loginWithFacebook = () => {
        // TODO: Thay YOUR_FACEBOOK_APP_ID bằng App ID của bạn
        const facebookAppId = "YOUR_FACEBOOK_APP_ID";
        const redirectUri = encodeURIComponent(window.location.origin + "/auth/facebook/callback");

        const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${facebookAppId}&redirect_uri=${redirectUri}&scope=email,public_profile`;

        window.location.href = facebookAuthUrl;
    };

    const handleBack = () => {
        window.history.back();
        // Hoặc nếu dùng react-router-dom: 
        // import { useNavigate } from 'react-router-dom';
        // const navigate = useNavigate();
        // navigate(-1);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                {/* Nút Back */}
                <button className="btn-back" onClick={handleBack}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    <span>Trở về</span>
                </button>

                <h2 className="login-title">Đăng nhập</h2>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="form-login">
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Nhập email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </div>

                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <input
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </div>

                    <button
                        className={`btn-login ${loading ? 'loading' : ''}`}
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? "Đang xử lý..." : "Đăng nhập"}
                    </button>
                </div>

                <div className="divider">
                    <span>Hoặc đăng nhập bằng</span>
                </div>

                <div className="social-login">
                    <button className="btn-social google" onClick={loginWithGoogle}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span>Google</span>
                    </button>

                    <button className="btn-social facebook" onClick={loginWithFacebook}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        <span>Facebook</span>
                    </button>
                </div>

                <div className="signup-link">
                    <span>Bạn chưa có tài khoản? </span>
                    <a href="/register">Tạo tài khoản</a>
                </div>
            </div>
        </div>
    );
}
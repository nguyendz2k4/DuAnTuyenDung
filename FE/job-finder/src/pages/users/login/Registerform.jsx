// RegisterForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Registerform.scss";

const API_BASE_URL = "https://localhost:7099/api";

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        userName: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        if (!formData.fullName.trim()) return "Vui lòng nhập họ tên";
        if (!formData.email.trim()) return "Vui lòng nhập email";
        if (!formData.userName.trim()) return "Vui lòng nhập tên đăng nhập";
        if (!formData.password) return "Vui lòng nhập mật khẩu";
        if (formData.password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
        if (formData.password !== formData.confirmPassword) return "Mật khẩu xác nhận không khớp";
        return null;
    };

    const handleRegister = async () => {
        setError("");
        setSuccess("");

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    userName: formData.userName,
                    password: formData.password,
                    accountType: "JobSeeker",
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess("Đăng ký thành công! Đang chuyển đến trang đăng nhập...");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                // Xử lý lỗi validation từ ASP.NET ModelState (errors là object)
                if (data.errors) {
                    const messages = Object.values(data.errors).flat();
                    setError(messages[0]);
                    // Lỗi từ _userManager.CreateAsync (Errors là mảng, chữ E hoa)
                } else if (data.Errors) {
                    setError(data.Errors[0]);
                    // Lỗi 500 từ catch block BE (Error là string, chữ E hoa)
                } else if (data.Error) {
                    setError(data.Error);
                } else {
                    setError(data.Message || data.message || data.title || "Đăng ký thất bại");
                }
            }
        } catch (err) {
            setError("Không thể kết nối đến máy chủ");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleRegister();
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <button className="btn-back" onClick={() => navigate(-1)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    <span>Trở về</span>
                </button>

                <h2 className="register-title">Tạo tài khoản</h2>
                <p className="register-subtitle">Tham gia để tìm kiếm việc làm phù hợp</p>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <div className="form-register">
                    <div className="form-group">
                        <label>Họ và tên</label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Nhập họ và tên"
                            value={formData.fullName}
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Nhập email"
                                value={formData.email}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                            />
                        </div>

                        <div className="form-group">
                            <label>Tên đăng nhập</label>
                            <input
                                type="text"
                                name="userName"
                                placeholder="Nhập tên đăng nhập"
                                value={formData.userName}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Mật khẩu</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Ít nhất 6 ký tự"
                                value={formData.password}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                            />
                        </div>

                        <div className="form-group">
                            <label>Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Nhập lại mật khẩu"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                            />
                        </div>
                    </div>

                    <button
                        className={`btn-register ${loading ? "loading" : ""}`}
                        onClick={handleRegister}
                        disabled={loading}
                    >
                        {loading ? "Đang xử lý..." : "Tạo tài khoản"}
                    </button>
                </div>

                <div className="login-link">
                    <span>Đã có tài khoản?</span>
                    <a href="/login">Đăng nhập ngay</a>
                </div>
            </div>
        </div>
    );
}
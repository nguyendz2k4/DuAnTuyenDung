import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await authService.adminLogin(email, password);

      // Lưu session qua AuthContext (tự động sync localStorage)
      login(data.token, {
        userId: (data.user?.id || data.user?.userId || "").toString(),
        fullName: data.user?.fullName ?? "",
        email: data.user?.email ?? "",
        role: data.user?.role ?? "",
        avatar: data.user?.avatar,
      });

      navigate("/");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { Message?: string; message?: string } } };
        setError(
          axiosErr.response?.data?.Message ||
          axiosErr.response?.data?.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra lại."
        );
      } else {
        setError("Không thể kết nối đến server. Vui lòng kiểm tra Backend đã chạy chưa.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Đăng nhập | Admin" description="Trang đăng nhập quản trị viên" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .signin-root {
          min-height: 100vh;
          display: flex;
          font-family: 'Outfit', sans-serif;
          background: #0a0a0f;
          overflow: hidden;
        }

        /* LEFT PANEL */
        .signin-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 48px 40px;
          position: relative;
          z-index: 1;
        }

        .signin-card {
          width: 100%;
          max-width: 420px;
        }

        .signin-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 40px;
        }

        .signin-brand-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .signin-brand-icon svg {
          width: 20px;
          height: 20px;
          fill: white;
        }

        .signin-brand-name {
          font-family: 'Space Mono', monospace;
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.5px;
        }

        .signin-heading {
          font-size: 32px;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.2;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .signin-sub {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 36px;
        }

        .signin-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 10px;
          padding: 12px 14px;
          color: #f87171;
          font-size: 13px;
          margin-bottom: 20px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
          line-height: 1.5;
        }

        .field-group {
          margin-bottom: 18px;
        }

        .field-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #9ca3af;
          margin-bottom: 8px;
          letter-spacing: 0.3px;
        }

        .field-input-wrap {
          position: relative;
        }

        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 14px 16px;
          color: #fff;
          font-size: 15px;
          font-family: 'Outfit', sans-serif;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }

        .field-input:focus {
          border-color: #6366f1;
          background: rgba(99,102,241,0.06);
        }

        .field-input::placeholder {
          color: #374151;
        }

        .field-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .field-input.has-icon {
          padding-right: 48px;
        }

        .field-icon-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #4b5563;
          display: flex;
          align-items: center;
          padding: 4px;
          transition: color 0.2s;
        }

        .field-icon-btn:hover {
          color: #9ca3af;
        }

        .signin-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          font-family: 'Outfit', sans-serif;
          cursor: pointer;
          margin-top: 8px;
          position: relative;
          overflow: hidden;
          transition: opacity 0.2s, transform 0.15s;
          letter-spacing: 0.2px;
        }

        .signin-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
        }

        .signin-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .signin-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .signin-btn-loader {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .signin-footer {
          margin-top: 28px;
          text-align: center;
          font-size: 13px;
          color: #4b5563;
        }

        /* RIGHT PANEL */
        .signin-right {
          flex: 1;
          display: none;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #0f0f1a 0%, #1a1040 50%, #0d1a3a 100%);
        }

        @media (min-width: 900px) {
          .signin-right {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 48px;
          }
        }

        .right-glow-1 {
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%);
          top: -80px;
          right: -80px;
          pointer-events: none;
        }

        .right-glow-2 {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%);
          bottom: 40px;
          left: -60px;
          pointer-events: none;
        }

        .right-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .right-content {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 380px;
        }

        .right-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.3);
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 500;
          color: #818cf8;
          letter-spacing: 0.5px;
          margin-bottom: 28px;
          text-transform: uppercase;
        }

        .right-title {
          font-size: 36px;
          font-weight: 700;
          color: #fff;
          line-height: 1.25;
          margin-bottom: 16px;
          letter-spacing: -0.5px;
        }

        .right-title span {
          background: linear-gradient(90deg, #818cf8, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .right-desc {
          font-size: 15px;
          color: #6b7280;
          line-height: 1.7;
          margin-bottom: 36px;
        }

        .right-stats {
          display: flex;
          gap: 20px;
          justify-content: center;
        }

        .stat-box {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 16px 20px;
          text-align: center;
        }

        .stat-num {
          font-family: 'Space Mono', monospace;
          font-size: 22px;
          font-weight: 700;
          color: #818cf8;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 11px;
          color: #4b5563;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        @media (max-width: 480px) {
          .signin-left {
            padding: 32px 24px;
          }
          .signin-heading {
            font-size: 26px;
          }
        }
      `}</style>

      <div className="signin-root">
        {/* LEFT */}
        <div className="signin-left">
          <div className="signin-card">
            <div className="signin-brand">
              <div className="signin-brand-icon">
                <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
              </div>
              <span className="signin-brand-name">AdminPanel</span>
            </div>

            <h1 className="signin-heading">Chào mừng trở lại</h1>
            <p className="signin-sub">Đăng nhập để quản lý hệ thống</p>

            {error && (
              <div className="signin-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="field-group">
                <label className="field-label">Email</label>
                <div className="field-input-wrap">
                  <input
                    type="email"
                    className="field-input"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Mật khẩu</label>
                <div className="field-input-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="field-input has-icon"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="field-icon-btn"
                    onClick={() => setShowPassword(v => !v)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="signin-btn" disabled={loading}>
                {loading ? (
                  <span className="signin-btn-loader">
                    <span className="spinner" />
                    Đang xử lý...
                  </span>
                ) : "Đăng nhập"}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT */}
        <div className="signin-right">
          <div className="right-glow-1" />
          <div className="right-glow-2" />
          <div className="right-grid" />
          <div className="right-content">
            <div className="right-badge">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="5" /></svg>
              Hệ thống quản trị
            </div>
            <h2 className="right-title">Quản lý toàn bộ<br />hệ thống <span>tuyển dụng</span></h2>
            <p className="right-desc">Theo dõi người dùng, tin tuyển dụng, đơn ứng tuyển và mọi hoạt động trên nền tảng từ một nơi duy nhất.</p>
            <div className="right-stats">
              <div className="stat-box">
                <div className="stat-num">1.2k+</div>
                <div className="stat-label">Người dùng</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">340+</div>
                <div className="stat-label">Tin đăng</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">98%</div>
                <div className="stat-label">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
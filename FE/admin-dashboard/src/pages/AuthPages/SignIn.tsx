// Đây là file: ./pages/AuthPages/SignIn.tsx (Đã được sửa)

import { useState, FormEvent } from "react"; // <-- Lấy từ login.tsx
import { useNavigate } from "react-router-dom"; // <-- Lấy từ login.tsx

import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
// KHÔNG import SignInForm nữa, vì chúng ta sẽ định nghĩa form ngay bên dưới

export default function SignIn() {
  // --- PHẦN LOGIC (TỪ LOGIN.TSX) ---
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // <-- Quan trọng: Ngăn trang tải lại
    setError("");
    setLoading(true);

    console.log("=== BẮT ĐẦU ĐĂNG NHẬP ===");
    console.log("Username:", username);
    console.log("Password:", password ? "***" : "(empty)");

    try {
      console.log("Đang gửi request tới: http://localhost/DuAnWebTuyenDung/BE/admin/login.php");

      // Đảm bảo URL này là ĐÚNG
      const res = await fetch("http://localhost/DuAnWebTuyenDung/BE/admin/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      console.log("Response Status:", res.status);
      console.log("Response OK:", res.ok);

      const data = await res.json();
      console.log("Response Data:", data);

      if (data.success) {
        console.log("✅ Đăng nhập thành công!");
        localStorage.setItem("role", data.role);
        localStorage.setItem("user", data.user);
        localStorage.setItem("email", data.email || "");
        localStorage.setItem("userId", data.id || "");

        console.log("Chuyển hướng về trang chủ...");
        navigate("/");
      } else {
        console.log("❌ Đăng nhập thất bại:", data.message);
        setError(data.message);
      }
    } catch (err) {
      console.error("❌ LỖI:", err);
      setError("Không thể kết nối đến server. Vui lòng kiểm tra XAMPP đã bật chưa.");
    } finally {
      setLoading(false);
    }
  };
  // --- KẾT THÚC PHẦN LOGIC ---


  // --- PHẦN GIAO DIỆN (JSX) ---
  return (
    <>
      <PageMeta
        title="Đăng nhập | TailAdmin" // Bạn có thể sửa title
        description="Trang đăng nhập"
      />
      {/* 1. Vẫn dùng AuthLayout đẹp của template */}
      <AuthLayout>

        {/* 2. Thay vì <SignInForm />, ta dùng Form từ login.tsx */}
        {/* Bạn có thể thay thế các className bên dưới bằng className của template */}
        <form
          onSubmit={handleLogin} // <-- Gắn hàm xử lý
          className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Đăng nhập</h2>

          {/* Hiển thị lỗi */}
          {error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          {/* Input Tên đăng nhập */}
          <input
            type="text"
            placeholder="Tên đăng nhập hoặc Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading}
          />

          {/* Input Mật khẩu */}
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading}
          />

          {/* Nút Đăng nhập */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white py-2 px-4 rounded w-full hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </AuthLayout>
    </>
  );
}
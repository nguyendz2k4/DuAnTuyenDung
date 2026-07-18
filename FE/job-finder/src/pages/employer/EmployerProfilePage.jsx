import { useAuth } from "../../context/AuthContext";

export default function EmployerProfilePage() {
  const { user } = useAuth();
  const name = user?.full_name || user?.fullName || "Nhà tuyển dụng";

  return (
    <section>
      <div className="employer-page__heading"><h1>Hồ sơ doanh nghiệp</h1><p>Thông tin tài khoản nhà tuyển dụng đang đăng nhập.</p></div>
      <article className="employer-card">
        <h2>{name}</h2>
        <p>Email: {user?.email || "Chưa cập nhật"}</p>
        <p>Khu vực chỉnh sửa hồ sơ doanh nghiệp sẽ được quản lý độc lập với admin dashboard.</p>
      </article>
    </section>
  );
}

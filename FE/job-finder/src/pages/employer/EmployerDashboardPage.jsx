import { Link } from "react-router-dom";
import { ROUTES } from "../../utils/router";

export default function EmployerDashboardPage() {
  return (
    <section>
      <div className="employer-page__heading">
        <h1>Không gian nhà tuyển dụng</h1>
        <p>Quản lý hoạt động tuyển dụng của doanh nghiệp tại một nơi riêng biệt.</p>
      </div>
      <div className="employer-grid">
        <article className="employer-card">
          <h2>Đăng tin tuyển dụng</h2>
          <p>Tạo và gửi tin tuyển dụng mới cho ứng viên trên nền tảng.</p>
          <Link to={ROUTES.EMPLOYER.POST_JOB}>Tạo tin tuyển dụng</Link>
        </article>
        <article className="employer-card">
          <h2>Quản lý ứng viên</h2>
          <p>Xem hồ sơ đã nộp, cập nhật trạng thái và theo dõi quy trình tuyển chọn.</p>
          <Link to={ROUTES.EMPLOYER.APPLICATIONS}>Xem ứng viên</Link>
        </article>
        <article className="employer-card">
          <h2>Hồ sơ doanh nghiệp</h2>
          <p>Cập nhật thông tin doanh nghiệp để xây dựng thương hiệu tuyển dụng.</p>
          <Link to={ROUTES.EMPLOYER.PROFILE}>Xem hồ sơ</Link>
        </article>
      </div>
    </section>
  );
}

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../utils/router";

export default function EmployerHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const name = user?.full_name || user?.fullName || "Nhà tuyển dụng";

  const handleLogout = () => {
    logout();
    navigate(ROUTES.USER.HOME);
  };

  return (
    <header className="employer-header">
      <div className="employer-header__content">
        <Link className="employer-brand" to={ROUTES.EMPLOYER.HOME}>JobFinder Employer</Link>
        <nav className="employer-nav" aria-label="Điều hướng nhà tuyển dụng">
          <NavLink end to={ROUTES.EMPLOYER.HOME}>Tổng quan</NavLink>
          <NavLink to={ROUTES.EMPLOYER.POST_JOB}>Đăng tuyển</NavLink>
          <NavLink to={ROUTES.EMPLOYER.APPLICATIONS}>Ứng viên</NavLink>
          <NavLink to={ROUTES.EMPLOYER.PROFILE}>Hồ sơ công ty</NavLink>
        </nav>
        <details className="employer-user">
          <summary>{name}</summary>
          <div className="employer-user-menu">
            <button type="button" onClick={handleLogout}>Đăng xuất</button>
          </div>
        </details>
      </div>
    </header>
  );
}

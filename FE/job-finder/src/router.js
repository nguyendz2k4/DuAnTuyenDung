import { Routes, Route } from "react-router-dom";
import { ROUTES } from "./utils/router";

// Layouts
import MasterLayout from "./pages/users/theme/masterLayout";

// Pages
import HomePage from "./pages/users/homePage";
import DetailJob from "./pages/users/homePage/detailJob";
import FavoriteJobs from "./pages/users/favoriteJobs";
import AppliedJobs from "./pages/users/applied/AppliedJobsPage";
import LoginForm from "./pages/users/login/LoginForm";
import RegisterForm from "./pages/users/login/Registerform";
import GoogleCallback from "./pages/users/login/GoogleCallback";
import RegisterPro from "./pages/users/topcvPro/TopCVProRegister";

// Guards
import ProtectedRoute from "./components/common/ProtectedRoute";

const RouterCustom = () => {
    return (
        <Routes>
            {/* Trang chủ */}
            <Route
                path={ROUTES.USER.HOME}
                element={
                    <MasterLayout>
                        <HomePage />
                    </MasterLayout>
                }
            />

            {/* Trang chi tiết công việc */}
            <Route
                path={ROUTES.USER.JOB_DETAIL}
                element={
                    <MasterLayout>
                        <DetailJob />
                    </MasterLayout>
                }
            />

            {/* Trang việc làm đã ứng tuyển (cần đăng nhập) */}
            <Route
                path={ROUTES.USER.APPLIED_JOBS}
                element={
                    <ProtectedRoute>
                        <MasterLayout>
                            <AppliedJobs />
                        </MasterLayout>
                    </ProtectedRoute>
                }
            />

            {/* Trang việc làm yêu thích (cần đăng nhập) */}
            <Route
                path={ROUTES.USER.FAVORITE_JOBS}
                element={
                    <ProtectedRoute>
                        <MasterLayout>
                            <FavoriteJobs />
                        </MasterLayout>
                    </ProtectedRoute>
                }
            />

            {/* Auth pages - Không cần layout */}
            <Route path={ROUTES.USER.LOGIN} element={<LoginForm />} />
            <Route path={ROUTES.USER.REGISTER} element={<RegisterForm />} />
            <Route path={ROUTES.USER.GOOGLE_CALLBACK} element={<GoogleCallback />} />

            {/* TopCV Pro (cần đăng nhập) */}
            <Route
                path={ROUTES.USER.TOPCV_PRO}
                element={
                    <ProtectedRoute>
                        <RegisterPro />
                    </ProtectedRoute>
                }
            />

            {/* 404 - Not Found */}
            <Route
                path="*"
                element={
                    <MasterLayout>
                        <div style={{
                            textAlign: "center",
                            padding: "80px 20px",
                            minHeight: "50vh",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <h1 style={{ fontSize: "72px", color: "#00b14f", margin: 0 }}>404</h1>
                            <p style={{ fontSize: "18px", color: "#666", marginTop: "12px" }}>
                                Trang bạn tìm kiếm không tồn tại
                            </p>
                        </div>
                    </MasterLayout>
                }
            />
        </Routes>
    );
};

export default RouterCustom;
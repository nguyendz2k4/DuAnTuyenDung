import { Routes, Route } from "react-router-dom";
import { ROUTES } from "./utils/router";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import CandidateLayout from "./layouts/CandidateLayout";
import EmployerLayout from "./layouts/EmployerLayout";

// Pages
import HomePage from "./pages/users/homePage";
import DetailJob from "./pages/users/homePage/detailJob";
import FavoriteJobs from "./pages/users/favoriteJobs";
import AppliedJobs from "./pages/users/applied/AppliedJobsPage";
import LoginForm from "./pages/users/login/LoginForm";
import RegisterForm from "./pages/users/login/Registerform";
import GoogleCallback from "./pages/users/login/GoogleCallback";
import RegisterPro from "./pages/users/topcvPro/TopCVProRegister";
import EmployerDashboardPage from "./pages/employer/EmployerDashboardPage";
import EmployerPostJobPage from "./pages/employer/EmployerPostJobPage";
import EmployerApplicationsPage from "./pages/employer/EmployerApplicationsPage";
import EmployerProfilePage from "./pages/employer/EmployerProfilePage";

// Guards
import ProtectedRoute from "./components/common/ProtectedRoute";

const RouterCustom = () => {
    return (
        <Routes>
            {/* Trang chủ */}
            <Route
                path={ROUTES.USER.HOME}
                element={
                    <PublicLayout>
                        <HomePage />
                    </PublicLayout>
                }
            />

            {/* Trang chi tiết công việc */}
            <Route
                path={ROUTES.USER.JOB_DETAIL}
                element={
                    <PublicLayout>
                        <DetailJob />
                    </PublicLayout>
                }
            />

            {/* Trang việc làm đã ứng tuyển (cần đăng nhập) */}
            <Route
                path={ROUTES.CANDIDATE.APPLIED_JOBS}
                element={
                    <ProtectedRoute allowedRoles={["jobseeker", "candidate"]}>
                        <CandidateLayout>
                            <AppliedJobs />
                        </CandidateLayout>
                    </ProtectedRoute>
                }
            />

            {/* Trang việc làm yêu thích (cần đăng nhập) */}
            <Route
                path={ROUTES.CANDIDATE.FAVORITE_JOBS}
                element={
                    <ProtectedRoute allowedRoles={["jobseeker", "candidate"]}>
                        <CandidateLayout>
                            <FavoriteJobs />
                        </CandidateLayout>
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
                    <ProtectedRoute allowedRoles={["jobseeker", "candidate"]}>
                        <CandidateLayout><RegisterPro /></CandidateLayout>
                    </ProtectedRoute>
                }
            />

            <Route path={ROUTES.EMPLOYER.HOME} element={<ProtectedRoute allowedRoles={["employer"]}><EmployerLayout><EmployerDashboardPage /></EmployerLayout></ProtectedRoute>} />
            <Route path={ROUTES.EMPLOYER.POST_JOB} element={<ProtectedRoute allowedRoles={["employer"]}><EmployerLayout><EmployerPostJobPage /></EmployerLayout></ProtectedRoute>} />
            <Route path={ROUTES.EMPLOYER.APPLICATIONS} element={<ProtectedRoute allowedRoles={["employer"]}><EmployerLayout><EmployerApplicationsPage /></EmployerLayout></ProtectedRoute>} />
            <Route path={ROUTES.EMPLOYER.PROFILE} element={<ProtectedRoute allowedRoles={["employer"]}><EmployerLayout><EmployerProfilePage /></EmployerLayout></ProtectedRoute>} />

            {/* 404 - Not Found */}
            <Route
                path="*"
                element={
                    <PublicLayout>
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
                    </PublicLayout>
                }
            />
        </Routes>
    );
};

export default RouterCustom;

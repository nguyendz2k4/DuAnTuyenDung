import { Routes, Route } from "react-router-dom";
import { ROUTES } from "./utils/router";
import HomePage from "./pages/users/homePage";
import MasterLayout from "./pages/users/theme/masterLayout";
import DetailJob from "./pages/users/homePage/detailJob";
import FavoriteJobs from "./pages/users/favoriteJobs";
import LoginForm from "./pages/users/login/LoginForm";
import RegisterForm from "./pages/users/login/Registerform";
import GoogleCallback from "./pages/users/login/GoogleCallback";
import RegisterPro from "./pages/users/topcvPro/TopCVProRegister";
import AppliedJobs from "./pages/users/applied/AppliedJobsPage";

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
                path="/job/:id"
                element={
                    <MasterLayout>
                        <DetailJob />
                    </MasterLayout>
                }
            />

            {/* Trang việc làm đã ứng tuyển */}
            <Route
                path="/applied-jobs"
                element={
                    <MasterLayout>
                        <AppliedJobs />
                    </MasterLayout>
                }
            />

            {/* Trang việc làm yêu thích*/}
            <Route
                path="/favorite-jobs"
                element={
                    <MasterLayout>
                        <FavoriteJobs />
                    </MasterLayout>
                }
            />

            {/* Trang đăng nhập */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/google-callback" element={<GoogleCallback />} />
            {/* Trang đăng ký */}
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/topcv-pro/register" element={<RegisterPro />} />
        </Routes>
    );
};

export default RouterCustom;
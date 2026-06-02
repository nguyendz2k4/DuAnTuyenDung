import { memo } from "react";
import { FaFacebookF, FaYoutube, FaLinkedinIn, FaTiktok } from "react-icons/fa";
import chplayIcon from "../../../../assets/imgs/icons/chplay.png";
import appstoreIcon from "../../../../assets/imgs/icons/app_store.png";
import BrandLogo from "../../../../components/common/BrandLogo";
import "./Footer.scss";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Cột 1 - Logo và liên hệ */}
                <div className="footer-col">
                    <div className="footer-logo">
                        <BrandLogo light={true} size="large" />
                    </div>
                    <p className="footer-slogan">Kết nối tài năng - Nâng tầm sự nghiệp khởi nghiệp</p>
                    <div className="footer-contact">
                        <p>
                            <strong>Hotline:</strong> (024) 8888 9999 (Giờ hành chính)
                        </p>
                        <p>
                            <strong>Email:</strong> hotro@topjob.vn
                        </p>
                    </div>
                    <div className="footer-app">
                        <p>Tải ứng dụng TopJob</p>
                        <div className="footer-app-images">
                            <img src={chplayIcon} alt="App Store" />
                            <img src={appstoreIcon} alt="Google Play" />
                        </div>
                    </div>
                </div>

                {/* Cột 2 */}
                <div className="footer-col">
                    <h3>Về TopJob</h3>
                    <ul>
                        <li>Giới thiệu</li>
                        <li>Góc báo chí</li>
                        <li>Tuyển dụng</li>
                        <li>Liên hệ</li>
                        <li>Hỏi đáp</li>
                        <li>Chính sách bảo mật</li>
                        <li>Điều khoản dịch vụ</li>
                    </ul>
                </div>

                {/* Cột 3 */}
                <div className="footer-col">
                    <h3>Khám phá</h3>
                    <ul>
                        <li>Ứng dụng di động TopJob</li>
                        <li>Tính lương Gross - Net</li>
                        <li>Tính lãi suất kép</li>
                        <li>Lập kế hoạch tiết kiệm</li>
                        <li>Tính bảo hiểm thất nghiệp</li>
                        <li>Trắc nghiệm MBTI</li>
                        <li>Trắc nghiệm MI</li>
                    </ul>
                </div>

                {/* Cột 4 */}
                <div className="footer-col">
                    <h3>Xây dựng sự nghiệp</h3>
                    <ul>
                        <li>Việc làm tốt nhất</li>
                        <li>Việc làm lương cao</li>
                        <li>Việc làm quản lý</li>
                        <li>Việc làm IT</li>
                        <li>Việc làm Senior</li>
                        <li>Việc làm bán thời gian</li>
                    </ul>
                </div>
            </div>

            {/* Dưới cùng */}
            <div className="footer-bottom">
                <p>Cộng đồng TopJob</p>
                <div className="footer-social">
                    <FaFacebookF />
                    <FaYoutube />
                    <FaLinkedinIn />
                    <FaTiktok />
                </div>
                <p className="footer-copy">
                    © 2026 TopJob Việt Nam. All rights reserved. Đồ án tốt nghiệp / Báo cáo thực tập.
                </p>
            </div>
        </footer>
    );
};

export default memo(Footer);

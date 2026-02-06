import { memo } from "react";
import { FaFacebookF, FaYoutube, FaLinkedinIn, FaTiktok } from "react-icons/fa";
import chplayIcon from "../../../../assets/imgs/icons/chplay.png";
import appstoreIcon from "../../../../assets/imgs/icons/app_store.png";
import logo from "../../../../assets/imgs/logo/topcv-logo-6.png";
import "./Footer.scss";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Cột 1 - Logo và liên hệ */}
                <div className="footer-col">
                    <div className="footer-logo">
                        <img src={logo} alt="TopCV Logo" />
                        {/* <span>topcv</span> */}
                    </div>
                    <p className="footer-slogan">Tiếp lợi thế - Nối thành công</p>
                    <div className="footer-contact">
                        <p>
                            <strong>Hotline:</strong> (024) 6680 5588 (Giờ hành chính)
                        </p>
                        <p>
                            <strong>Email:</strong> hotro@topcv.vn
                        </p>
                    </div>
                    <div className="footer-app">
                        <p>Ứng dụng tải xuống</p>
                        <div className="footer-app-images">
                            <img src={chplayIcon} alt="App Store" />
                            <img src={appstoreIcon} alt="Google Play" />
                        </div>
                    </div>
                </div>

                {/* Cột 2 */}
                <div className="footer-col">
                    <h3>Về TopCV</h3>
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
                        <li>Ứng dụng di động TopCV</li>
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
                <p>Cộng đồng TopCV</p>
                <div className="footer-social">
                    <FaFacebookF />
                    <FaYoutube />
                    <FaLinkedinIn />
                    <FaTiktok />
                </div>
                <p className="footer-copy">
                    © 2025 TopCV Việt Nam. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default memo(Footer);

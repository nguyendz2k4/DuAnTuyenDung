import "./popup.scss";
import { FiX, FiUser, FiHelpCircle, FiMessageSquare, FiPhone } from "react-icons/fi";

export default function SupportPopup({ onClose }) {
    return (
        <div className="popup-overlay">
            <div className="popup-box">

                <div className="popup-header">
                    <div className="title">Trung tâm hỗ trợ ứng viên</div>
                    <FiX className="close-btn" onClick={onClose} />
                </div>

                <div className="popup-profile">
                    <img src="/img/support.png" alt="Support" />
                    <div>
                        <h3>Ms. Hương Nguyễn</h3>
                        <p>TopCV thường phản hồi trong vòng 24h</p>
                    </div>
                </div>

                <div className="popup-menu">
                    <div className="menu-item">
                        <FiHelpCircle /> Hướng dẫn tìm việc an toàn
                    </div>
                    <div className="menu-item">
                        <FiUser /> Hướng dẫn quản lý tài khoản
                    </div>
                    <div className="menu-item">
                        <FiMessageSquare /> Các câu hỏi thường gặp
                    </div>
                    <div className="menu-item">
                        <FiPhone /> Yêu cầu hỗ trợ
                    </div>
                    <div className="menu-item">
                        <FiPhone /> Liên hệ TopCV
                    </div>
                </div>

            </div>
        </div>
    );
}

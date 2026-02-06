import { useState } from "react";
import { FiX } from "react-icons/fi";
import "./FeedbackPopup.scss";

export default function FeedbackPopup({ onClose }) {
    const [selectedTopic, setSelectedTopic] = useState("");
    const [feedbackText, setFeedbackText] = useState("");
    const [selectedSatisfaction, setSelectedSatisfaction] = useState("");

    const topics = [
        "Công cụ tạo CV",
        "Công cụ tìm kiếm",
        "Tính năng/Giao diện trang web",
        "Thông báo việc làm",
        "Thông tin công ty",
        "Khác"
    ];

    const satisfactionLevels = [
        { value: "bad", label: "Rất tệ", emoji: "😞" },
        { value: "poor", label: "Tệ", emoji: "😕" },
        { value: "normal", label: "Bình thường", emoji: "😊" },
        { value: "good", label: "Tốt", emoji: "😄" },
        { value: "excellent", label: "Tuyệt vời", emoji: "😍" }
    ];

    const handleSubmit = () => {
        // Xử lý gửi phản hồi
        console.log({
            topic: selectedTopic,
            feedback: feedbackText,
            satisfaction: selectedSatisfaction
        });
        onClose();
    };

    return (
        <div className="feedback-popup-overlay" onClick={onClose}>
            <div className="feedback-popup" onClick={(e) => e.stopPropagation()}>
                <div className="popup-header">
                    <h2>Góp ý sản phẩm</h2>
                    <button className="close-btn" onClick={onClose}>
                        <FiX />
                    </button>
                </div>

                <div className="popup-content">
                    <p className="description">
                        Phản hồi của bạn rất quan trọng, TopCV mong nhận được nhiều góp ý từ bạn để cải thiện sản phẩm tốt hơn.
                    </p>

                    <div className="form-group">
                        <label>
                            Chủ đề cần góp ý <span className="required">*</span>
                        </label>
                        <div className="topic-buttons">
                            {topics.map((topic) => (
                                <button
                                    key={topic}
                                    className={`topic-btn ${selectedTopic === topic ? "active" : ""}`}
                                    onClick={() => setSelectedTopic(topic)}
                                >
                                    {topic}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>
                            Mô tả góp ý <span className="required">*</span>
                        </label>
                        <textarea
                            placeholder="Mô tả góp ý của bạn giúp TopCV cải tiến sản phẩm, hỗ trợ bạn tốt hơn"
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            rows={6}
                        />
                    </div>

                    <div className="form-group">
                        <label>Bạn có hài lòng với TopCV không?</label>
                        <div className="satisfaction-buttons">
                            {satisfactionLevels.map((level) => (
                                <button
                                    key={level.value}
                                    className={`satisfaction-btn ${selectedSatisfaction === level.value ? "active" : ""}`}
                                    onClick={() => setSelectedSatisfaction(level.value)}
                                >
                                    <span className="emoji">{level.emoji}</span>
                                    <span className="label">{level.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="popup-footer">
                    <button className="cancel-btn" onClick={onClose}>
                        Hủy
                    </button>
                    <button 
                        className="submit-btn" 
                        onClick={handleSubmit}
                        disabled={!selectedTopic || !feedbackText}
                    >
                        Gửi phản hồi
                    </button>
                </div>
            </div>
        </div>
    );
}
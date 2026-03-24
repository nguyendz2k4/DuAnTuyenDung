import { useState } from "react";
import { FiHeart, FiUserPlus, FiShield, FiMessageSquare, FiHeadphones } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useFavorite } from "../../../../context/FavoriteContext"; 
import SupportPopup from "./SupportPopup";
import FeedbackPopup from "./FeedbackPopup";

import "./style.scss";

export default function RightSidebar() {
    const [showSupport, setShowSupport] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const { favoriteCount } = useFavorite();
    const navigate = useNavigate();

    const handleHeartClick = () => {
        navigate("/favorite-jobs"); 
    };

    return (
        <>
            <div className="right-sidebar">
                <div className="icon-group">
                    <div className="icon-item-wrapper" onClick={handleHeartClick}>
                        <div className="icon-item">
                            <FiHeart />
                            {favoriteCount > 0 && (
                                <span className="badge">{favoriteCount}</span>
                            )}
                        </div>
                    </div>

                    <a href="/suggest-friends" className="icon-item">
                        <FiUserPlus />
                    </a>
                    <a href="/security" className="icon-item">
                        <FiShield />
                    </a>
                </div>

                <div className="bottom-group">
                    <div
                        className="text-item"
                        onClick={() => setShowFeedback(true)}
                    >
                        <FiMessageSquare /> Góp ý
                    </div>

                    <div
                        className="text-item"
                        onClick={() => setShowSupport(true)}
                    >
                        <FiHeadphones /> Hỗ trợ
                    </div>
                </div>
            </div>

            {/* POPUP GÓP Ý */}
            {showFeedback && (
                <FeedbackPopup onClose={() => setShowFeedback(false)} />
            )}

            {/* POPUP HỖ TRỢ */}
            {showSupport && (
                <SupportPopup onClose={() => setShowSupport(false)} />
            )}
        </>
    );
}
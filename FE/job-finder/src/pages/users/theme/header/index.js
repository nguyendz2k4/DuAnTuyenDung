import { memo, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBell, FiMessageCircle, FiUser, FiLogOut } from "react-icons/fi";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { IoIosSearch, IoIosList } from "react-icons/io";
import { useAuth } from "../../../../context/AuthContext";
import { ROUTES } from "../../../../utils/router";
import JoblistDropdown from "./JoblistDropdown";
import BrandLogo from "../../../../components/common/BrandLogo";
import "./style.scss";

const Header = () => {
    const [openMenu, setOpenMenu] = useState(false);
    const [showCategory, setShowCategory] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const { user: currentUser, isAuthenticated, logout } = useAuth();
    const dropdownRef = useRef(null);
    const userMenuRef = useRef(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        navigate(ROUTES.USER.LOGIN);
    };

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowCategory(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="header-container">
            <div className="header-top">
                <div className="header-left">
                    <BrandLogo />
                </div>
                {/* NAVIGATION MENU */}
                <nav className="header-nav">
                    <div className="nav-item">
                        <div className="nav-title">
                            Việc làm <BsChevronDown className="icon-down" /> <BsChevronUp className="icon-up" />
                        </div>
                        <div className="dropdown-menu">
                            <Link to={ROUTES.USER.HOME} className="dropdown-item">Việc làm mới nhất</Link>
                            <Link to={ROUTES.CANDIDATE.FAVORITE_JOBS} className="dropdown-item">Việc làm đã lưu</Link>
                            <Link to={ROUTES.CANDIDATE.APPLIED_JOBS} className="dropdown-item">
                                Việc làm đã ứng tuyển
                            </Link>
                        </div>
                    </div>

                    <div className="nav-item">
                        <div className="nav-title">Hồ sơ & CV</div>
                    </div>
                    <div className="nav-item">
                        <div className="nav-title">Công cụ</div>
                    </div>
                </nav>

                {/* KHU VỰC TÀI KHOẢN VÀ ACTION */}
                <div className="header-icons">
                    <button className="icon-btn"><FiBell size={20} /></button>
                    <button className="icon-btn"><FiMessageCircle size={20} /></button>

                    {/* --- LOGIC HIỂN THỊ USER --- */}
                    {isAuthenticated && currentUser ? (
                        <>
                            {/* 1. Hiển thị Avatar & Menu User */}
                            <div className="user-account" ref={userMenuRef} onClick={() => setShowUserMenu(!showUserMenu)}>
                                <div className="avatar-wrapper">
                                    {currentUser.avatar ? (
                                        <img src={currentUser.avatar} alt="Avt" className="user-avatar-tiny" />
                                    ) : (
                                        <div className="avatar-circle">
                                            {currentUser.full_name ? currentUser.full_name.charAt(0).toUpperCase() : "U"}
                                        </div>
                                    )}
                                    <div className="dropdown-badge">
                                        <BsChevronDown size={8} />
                                    </div>
                                </div>

                                {showUserMenu && (
                                    <div className="user-dropdown">
                                        <div className="user-dropdown-item">
                                            <strong>{currentUser.full_name}</strong>
                                            <div style={{ fontSize: '12px', color: '#666' }}>{currentUser.email}</div>
                                        </div>
                                        <div className="user-dropdown-item logout" onClick={handleLogout}>
                                            <FiLogOut style={{ marginRight: 5 }} /> Đăng xuất
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 2. Vạch ngăn cách */}
                            <div className="divider-vertical"></div>

                            {/* 3. Phần Nhà Tuyển Dụng */}
                            <div className="employer-section">
                                <span className="emp-text">{String(currentUser.role || currentUser.account_type || "").toLowerCase() === "employer" ? "Khu vực tuyển dụng" : "Bạn là nhà tuyển dụng?"}</span>
                                <Link to={String(currentUser.role || currentUser.account_type || "").toLowerCase() === "employer" ? ROUTES.EMPLOYER.HOME : ROUTES.USER.REGISTER} className="emp-link">
                                    {String(currentUser.role || currentUser.account_type || "").toLowerCase() === "employer" ? "Vào dashboard »" : "Đăng ký ngay »"}
                                </Link>
                            </div>
                        </>
                    ) : (
                        /* TRƯỜNG HỢP 2: CHƯA ĐĂNG NHẬP */
                        <Link to={ROUTES.USER.LOGIN} className="login-link">
                            <FiUser size={20} />
                            <span>Đăng nhập</span>
                        </Link>
                    )}

                    {/* Nút Mobile Menu */}
                    <button className="mobile-menu-btn" onClick={() => setOpenMenu(!openMenu)}>
                        <span></span><span></span><span></span>
                    </button>
                </div>
            </div>

            {/* Search bar */}
            <div className="header-search" ref={dropdownRef}>
                <div className="category-dropdown-wrapper">
                    <button className="category-btn" onClick={() => setShowCategory(!showCategory)}>
                        <IoIosList size={20} /> <span>Danh mục Nghề</span>
                    </button>
                    {showCategory && (
                        <div className="category-dropdown-panel">
                            <JoblistDropdown onClose={() => setShowCategory(false)} />
                        </div>
                    )}
                </div>
                <input type="text" placeholder="Vị trí tuyển dụng, tên công ty" className="search-input" />

                <button className="search-btn">
                    <IoIosSearch size={18} />
                    <span>Tìm kiếm</span>
                </button>
            </div>
        </header>
    );
};

export default memo(Header);

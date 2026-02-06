import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./style.scss";
import {
    FaSearch,
    FaMapMarkerAlt,
    FaMoneyBillAlt,
    FaBriefcase,
    FaCalendarAlt,
    FaChevronLeft,
    FaChevronRight
} from "react-icons/fa";

const API = "http://localhost/DuAnWebTuyenDung/BE/admin/get-applied-jobs.php";
const LOGO_BASE = "http://localhost/DuAnWebTuyenDung/public/logos/";

const getLogoUrl = (logo) => {
    if (!logo) return "/images/default-company.png";
    if (logo.startsWith("http")) return logo;
    if (!logo.includes("/")) return LOGO_BASE + logo;
    if (logo.startsWith("/")) return "http://localhost/DuAnWebTuyenDung" + logo;
    return "http://localhost/DuAnWebTuyenDung/" + logo;
};

const statusLabel = (s) => {
    if (!s) return "Đang xử lý";
    return s;
};

export default function AppliedJobsPage({ seekerId: propSeekerId }) {
    const [currentSeekerId, setCurrentSeekerId] = useState(propSeekerId || null);

    const [items, setItems] = useState([]);
    const [status, setStatus] = useState("all");
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
    const limit = 10;

    const filters = useMemo(() => ([
        { key: "all", label: "Tất cả" },
        { key: "pending", label: "Đang xử lý" },
        { key: "viewed", label: "NTD đã xem" },
        { key: "accepted", label: "Phù hợp" },
        { key: "rejected", label: "Từ chối" },
    ]), []);

    useEffect(() => {
        if (propSeekerId) {
            setCurrentSeekerId(propSeekerId);
        } else {
            const storedUser = localStorage.getItem("user");

            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    console.log("Thông tin user từ LocalStorage:", parsedUser);
                    const id = parsedUser.seeker_id || parsedUser.id || parsedUser.user_id;

                    if (id) {
                        setCurrentSeekerId(id);
                        console.log("--> Đã set Seeker ID thành:", id);
                    } else {
                        console.warn("Không tìm thấy seeker_id hay user_id trong localStorage");
                    }
                } catch (error) {
                    console.error("Lỗi parse localStorage:", error);
                }
            } else {
                console.warn("Chưa đăng nhập (Không tìm thấy key 'user' trong localStorage)");
            }
        }
    }, [propSeekerId]);

    const fetchData = async () => {
        if (!currentSeekerId) return;

        console.log("Đang gọi API với seeker_id:", currentSeekerId);

        try {
            const res = await axios.get(API, {
                params: { seeker_id: currentSeekerId, page, limit, status, q }
            });
            if (res.data?.success) {
                setItems(res.data.data || []);
                setPagination(res.data.pagination || { page, limit, total: 0, totalPages: 1 });
            } else {
                setItems([]);
            }
        } catch (error) {
            console.error("Lỗi gọi API:", error);
            setItems([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentSeekerId, page, status]);

    const onSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchData();
    };

    return (
        <div className="applied-wrap">
            <div className="applied-container">
                {/* LEFT FILTER */}
                <aside className="applied-left">
                    <h3>Việc làm đã ứng tuyển</h3>

                    <form onSubmit={onSearch} className="search-box">
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Tìm theo tên việc làm / công ty..."
                        />
                        <button type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                            <FaSearch /> Tìm
                        </button>
                    </form>

                    <div className="filter-block">
                        <div className="filter-title">Trạng thái</div>
                        <div className="filter-list">
                            {filters.map(f => (
                                <button
                                    key={f.key}
                                    className={status === f.key ? "chip active" : "chip"}
                                    onClick={() => { setStatus(f.key); setPage(1); }}
                                    type="button"
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* RIGHT LIST */}
                <main className="applied-right">
                    <div className="list-head">
                        <div>Kết quả: <b>{pagination.total}</b></div>
                        <div>Trang <b>{pagination.page}</b>/<b>{pagination.totalPages}</b></div>
                    </div>

                    {/* Hiển thị cảnh báo nếu không có ID */}
                    {!currentSeekerId && (
                        <div className="alert-warning" style={{ padding: '10px', background: '#fff3cd', color: '#856404', marginBottom: '15px', borderRadius: '4px' }}>
                            Đang tải thông tin người dùng... (Nếu quá lâu, vui lòng đăng nhập lại)
                        </div>
                    )}

                    {items.length === 0 ? (
                        <div className="empty">
                            Chưa có việc làm đã ứng tuyển (hoặc không khớp bộ lọc).
                        </div>
                    ) : (
                        <div className="job-list">
                            {items.map((it) => (
                                <div className="job-card" key={it.application_id}>
                                    <img
                                        className="job-logo"
                                        src={getLogoUrl(it.logo)}
                                        alt={it.company_name}
                                        onError={(e) => (e.currentTarget.src = "/images/default-company.png")}
                                    />

                                    <div className="job-info">
                                        <div className="job-title">{it.title}</div>
                                        <div className="job-company">{it.company_name} • {it.industry_name || "—"}</div>
                                        <div className="job-meta">
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <FaMapMarkerAlt className="text-secondary" /> {it.location || "—"}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <FaMoneyBillAlt className="text-secondary" /> {it.salary_range || "Thỏa thuận"}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <FaBriefcase className="text-secondary" /> {it.job_type || "—"}
                                            </span>
                                        </div>

                                        <div className="job-meta2">
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <FaCalendarAlt /> Đã ứng tuyển: {it.applied_at || "—"}
                                            </span>
                                            <span className={`badge badge-${it.apply_status || "Chờ phản hồi"}`}>
                                                <i className="bi bi-send-check"></i>
                                                {statusLabel(it.apply_status)}
                                            </span>

                                        </div>
                                    </div>

                                    <div className="job-actions">
                                        <button type="button" className="btn-outline">Xem tin</button>
                                        <button type="button" className="btn-primary">Liên hệ</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="paging">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage(p => p - 1)}
                            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                            <FaChevronLeft /> Trước
                        </button>

                        <button
                            disabled={page >= pagination.totalPages}
                            onClick={() => setPage(p => p + 1)}
                            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                            Sau <FaChevronRight />
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useAuth } from "../../../context/AuthContext";
import applicationService from "../../../services/applicationService";
import { getImageUrl, logo_default } from "../../../utils/imageUtils";
import { APPLICATION_FILTERS, APPLIED_JOBS_PAGE_SIZE } from "../../../utils/constants";
import { getStatusLabel } from "../../../utils/formatters";
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

export default function AppliedJobsPage() {
    const { user } = useAuth();
    const currentSeekerId = user?.seeker_id || user?.id || user?.user_id || null;

    const [items, setItems] = useState([]);
    const [status, setStatus] = useState("all");
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ page: 1, limit: APPLIED_JOBS_PAGE_SIZE, total: 0, totalPages: 1 });

    const fetchData = useCallback(async () => {
        if (!currentSeekerId) return;

        try {
            const res = await applicationService.getAppliedJobs({
                seeker_id: currentSeekerId,
                page,
                limit: APPLIED_JOBS_PAGE_SIZE,
                status,
                q,
            });

            if (res?.success) {
                setItems(res.data || []);
                setPagination(res.pagination || { page, limit: APPLIED_JOBS_PAGE_SIZE, total: 0, totalPages: 1 });
            } else {
                setItems([]);
            }
        } catch (error) {
            console.error("Lỗi gọi API:", error);
            setItems([]);
        }
    }, [currentSeekerId, page, status, q]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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
                            {APPLICATION_FILTERS.map(f => (
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
                                <div className="job-card" key={it.application_id || it.applicationId}>
                                    <img
                                        className="job-logo"
                                        src={getImageUrl(it.logo || it.companyLogo)}
                                        alt={it.company_name || it.companyName}
                                        onError={(e) => (e.currentTarget.src = logo_default)}
                                    />

                                    <div className="job-info">
                                        <div className="job-title">{it.title}</div>
                                        <div className="job-company">{it.company_name || it.companyName} • {it.industry_name || it.industryName || "—"}</div>
                                        <div className="job-meta">
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <FaMapMarkerAlt className="text-secondary" /> {it.location || "—"}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <FaMoneyBillAlt className="text-secondary" /> {it.salary_range || it.salaryRange || "Thỏa thuận"}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <FaBriefcase className="text-secondary" /> {it.job_type || it.jobType || "—"}
                                            </span>
                                        </div>

                                        <div className="job-meta2">
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <FaCalendarAlt /> Đã ứng tuyển: {it.applied_at || it.appliedAt || "—"}
                                            </span>
                                            <span className={`badge badge-${it.apply_status || it.applyStatus || "pending"}`}>
                                                {getStatusLabel(it.apply_status || it.applyStatus)}
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
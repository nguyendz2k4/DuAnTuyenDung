import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import jobService from "../../../services/jobService";
import { resolveImageUrl } from "../../../utils/imageUtils";
import { formatDate, parseText } from "../../../utils/formatters";
import { ROUTES } from "../../../utils/router";
import ApplyModal from "../../../components/common/ApplyModal";
import "./detailJob.scss";

/**
 * Chuyển đổi dữ liệu API thành format hiển thị
 * Tách riêng ra khỏi component để dễ test và maintain
 */
const transformJobData = (apiJob) => {
    // 1. Xử lý ngày tháng
    const createdDate = apiJob.createdAt ? new Date(apiJob.createdAt) : new Date();
    const deadlineDate = new Date(createdDate);
    deadlineDate.setDate(createdDate.getDate() + 30);

    // 2. Xử lý danh sách ảnh
    let rawImages = [];
    if (apiJob.images) {
        rawImages = apiJob.images.includes(',')
            ? apiJob.images.split(',')
            : [apiJob.images];
    }
    const fullImages = rawImages.map(img => resolveImageUrl(img));

    // 3. Xử lý Logo
    const fullLogo = resolveImageUrl(apiJob.logo || apiJob.images);

    // 4. Tạo object hoàn chỉnh
    return {
        ...apiJob,
        title: apiJob.title,
        salary: apiJob.salaryRange || "Thỏa thuận",
        location: apiJob.location || "Toàn quốc",

        // Company Info
        company: apiJob.companyName || "Công ty ẩn danh",
        logo: fullLogo,
        companySize: apiJob.companySize || "Chưa cập nhật",
        industry: apiJob.nameIndustry || "Đa ngành",
        address: apiJob.address || apiJob.location,
        companyWebsite: apiJob.companyWebsite || "#",

        // Time
        deadline: formatDate(deadlineDate),
        createdAt: formatDate(createdDate),

        // Stats
        experience: apiJob.level || "Không yêu cầu",
        level: apiJob.level || "Nhân viên",
        education: apiJob.education || "Không yêu cầu",
        quantity: apiJob.quantity ? `${apiJob.quantity} người` : "Đang tuyển",
        viewCount: apiJob.viewCount || 0,

        // Lists
        descriptionList: parseText(apiJob.description),
        requirementsList: parseText(apiJob.requirements),
        benefitsList: [
            "Môi trường làm việc chuyên nghiệp",
            "Được đào tạo nâng cao nghiệp vụ",
            "Chế độ bảo hiểm đầy đủ theo quy định"
        ],
        expertiseList: parseText(apiJob.requirements).slice(0, 4),

        // Tags
        tags: [
            apiJob.categoryName,
            apiJob.jobType,
            apiJob.level
        ].filter(Boolean),

        // Gallery Images
        images: fullImages,
    };
};

const DetailJob = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { isAuthenticated } = useAuth();

    // State UI
    const [selectedImage, setSelectedImage] = useState(null);
    const [openApply, setOpenApply] = useState(false);

    // State Data
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobDetail = async () => {
            if (!id) return;

            try {
                setLoading(true);
                setError(null);
                
                const apiJob = await jobService.getJobDetail(id);

                if (apiJob) {
                    setJob(transformJobData(apiJob));
                } else {
                    setError("Không tìm thấy dữ liệu công việc.");
                }
            } catch (err) {
                console.error("Lỗi tải chi tiết job:", err);
                setError("Có lỗi xảy ra khi tải dữ liệu.");
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetail();
    }, [id]);

    // Kiểm tra auth trước khi mở form ứng tuyển
    const handleApplyClick = () => {
        if (!isAuthenticated) {
            navigate(ROUTES.USER.LOGIN, { state: { redirectTo: `/job/${id}` } });
            return;
        }
        setOpenApply(true);
    };

    // Render Loading
    if (loading) {
        return (
            <div className="detail-job__loading">
                <div className="spinner"></div>
                <p>Đang tải thông tin...</p>
            </div>
        );
    }

    // Render Error
    if (error || !job) {
        return (
            <div className="detail-job__notfound">
                <p>{error || "Không tìm thấy công việc."}</p>
                <button onClick={() => navigate(-1)}>← Quay lại</button>
            </div>
        );
    }

    // Render Main Content
    return (
        <div className="detail-job">
            {/* ===== HEADER ===== */}
            <header className="detail-job__header">
                <div className="header-left">
                    <h1 className="job-title">{job.title}</h1>
                    <div className="job-meta">
                        <div className="meta-item">
                            <span className="icon">💰</span>
                            <span>{job.salary}</span>
                        </div>
                        <div className="meta-item">
                            <span className="icon">📍</span>
                            <span>{job.location}</span>
                        </div>
                        <div className="meta-item">
                            <span className="icon">🎓</span>
                            <span>{job.experience}</span>
                        </div>
                        <div className="meta-item">
                            <span className="icon">👁️</span>
                            <span>{job.viewCount} lượt xem</span>
                        </div>
                    </div>

                    <div className="job-deadline">
                        <span>🕒 Hạn nộp hồ sơ: {job.deadline}</span>
                    </div>

                    <div className="job-actions">
                        <button className="btn-apply" onClick={handleApplyClick}>
                            Ứng tuyển ngay
                        </button>
                        <button className="btn-save">♡ Lưu tin</button>
                    </div>

                    <ApplyModal
                        open={openApply}
                        onClose={() => setOpenApply(false)}
                        job={job}
                    />
                </div>

                <div className="header-right">
                    <div className="company-card">
                        <img 
                            src={job.logo} 
                            alt={job.company} 
                            className="company-logo"
                            onError={(e) => e.target.style.display = 'none'} 
                        />
                        <h3 className="company-name">{job.company}</h3>

                        <ul className="company-info">
                            <li>👥 Quy mô: {job.companySize}</li>
                            <li>🏢 Lĩnh vực: {job.industry}</li>
                            <li>📍 Địa điểm: {job.address}</li>
                        </ul>

                        {job.companyWebsite !== "#" && (
                            <a
                                href={job.companyWebsite}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="view-company"
                            >
                                Xem trang công ty →
                            </a>
                        )}
                    </div>
                </div>
            </header>

            {/* ===== MAIN ===== */}
            <main className="detail-job__main">
                <section className="detail-job__content">
                    <div className="section">
                        <h2>Chi tiết tin tuyển dụng</h2>

                        {job.tags && job.tags.length > 0 && (
                            <div className="tags">
                                {job.tags.map((tag, index) => (
                                    <span key={index} className="tag">{tag}</span>
                                ))}
                            </div>
                        )}

                        <h3>Mô tả công việc</h3>
                        <ul className="list-disc">
                            {job.descriptionList.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>

                        <h3>Yêu cầu</h3>
                        <ul className="list-disc">
                            {job.requirementsList.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>

                        {job.expertiseList && job.expertiseList.length > 0 && (
                            <>
                                <h3>Chuyên môn (Tham khảo)</h3>
                                <ul className="list-disc">
                                    {job.expertiseList.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </>
                        )}

                        <h3>Quyền lợi</h3>
                        <ul className="list-disc">
                            {job.benefitsList.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>

                        {/* Gallery ảnh */}
                        {job.images && job.images.some(img => img) && (
                        <div className="job-images">
                            <h3>Hình ảnh văn phòng</h3>
                            <div className="image-gallery">
                                {job.images.map((image, index) => {
                                    if (!image || image === job.logo) return null;
                                    return (
                                        <div
                                            key={index}
                                            className="gallery-item"
                                            onClick={() => setSelectedImage(image)}
                                        >
                                            <img
                                                src={image}
                                                alt={`Ảnh ${index + 1}`}
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    </div>
                </section>

                <aside className="detail-job__sidebar">
                    <div className="sidebar-box">
                        <h3>Thông tin chung</h3>
                        <ul>
                            <li>🧑‍💼 Cấp bậc: {job.level}</li>
                            <li>🎓 Học vấn: {job.education}</li>
                            <li>👥 Số lượng tuyển: {job.quantity}</li>
                            <li>📅 Ngày đăng: {job.createdAt}</li>
                        </ul>
                    </div>

                    <div className="sidebar-box">
                        <h3>Địa điểm làm việc</h3>
                        <p>📍 {job.address}</p>
                    </div>

                    <div className="sidebar-box">
                        <h3>Cách thức ứng tuyển</h3>
                        <p>Ứng viên nộp hồ sơ trực tuyến bằng cách bấm <strong>Ứng tuyển ngay</strong> dưới đây.</p>
                        <button
                            className="btn-apply-sidebar"
                            onClick={handleApplyClick}
                        >
                            Ứng tuyển ngay
                        </button>
                        <p className="deadline-note">Hạn nộp hồ sơ: {job.deadline}</p>
                    </div>
                </aside>
            </main>

            {/* Modal xem ảnh */}
            {selectedImage && (
                <div className="image-modal" onClick={() => setSelectedImage(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close-btn" onClick={() => setSelectedImage(null)}>&times;</span>
                        <img src={selectedImage} alt="Preview" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailJob;
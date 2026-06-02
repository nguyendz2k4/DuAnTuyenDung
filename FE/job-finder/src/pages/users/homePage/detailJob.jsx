import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  FiDollarSign, 
  FiMapPin, 
  FiBriefcase, 
  FiEye, 
  FiClock, 
  FiUsers, 
  FiGrid, 
  FiArrowLeft, 
  FiHeart, 
  FiAward, 
  FiCalendar, 
  FiBookOpen, 
  FiCompass 
} from "react-icons/fi";
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
    const [isSaved, setIsSaved] = useState(false);

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
                <p>Đang tải thông tin việc làm...</p>
            </div>
        );
    }

    // Render Error
    if (error || !job) {
        return (
            <div className="detail-job__notfound">
                <p>{error || "Không tìm thấy công việc."}</p>
                <button onClick={() => navigate(-1)}>
                    <FiArrowLeft style={{ marginRight: "6px" }} /> Quay lại
                </button>
            </div>
        );
    }

    // Render Main Content
    return (
        <div className="detail-job">
            {/* ===== HEADER ===== */}
            <header className="detail-job__header">
                <div className="header-left">
                    <button className="back-link-btn" onClick={() => navigate(-1)}>
                        <FiArrowLeft /> <span>Quay lại trang danh sách</span>
                    </button>
                    
                    <h1 className="job-title">{job.title}</h1>
                    
                    <div className="job-meta">
                        <div className="meta-item">
                            <span className="icon-wrapper"><FiDollarSign /></span>
                            <span>{job.salary}</span>
                        </div>
                        <div className="meta-item">
                            <span className="icon-wrapper"><FiMapPin /></span>
                            <span>{job.location}</span>
                        </div>
                        <div className="meta-item">
                            <span className="icon-wrapper"><FiBriefcase /></span>
                            <span>{job.experience}</span>
                        </div>
                        <div className="meta-item">
                            <span className="icon-wrapper"><FiEye /></span>
                            <span>{job.viewCount} lượt xem</span>
                        </div>
                    </div>

                    <div className="job-deadline">
                        <FiClock className="clock-icon" /> <span>Hạn nộp hồ sơ: {job.deadline}</span>
                    </div>

                    <div className="job-actions">
                        <button className="btn-apply" onClick={handleApplyClick}>
                            Ứng tuyển ngay
                        </button>
                        <button 
                            className={`btn-save ${isSaved ? "is-saved" : ""}`}
                            onClick={() => setIsSaved(!isSaved)}
                        >
                            <FiHeart /> <span>{isSaved ? "Đã lưu" : "Lưu tin tuyển dụng"}</span>
                        </button>
                    </div>

                    <ApplyModal
                        open={openApply}
                        onClose={() => setOpenApply(false)}
                        job={job}
                    />
                </div>

                <div className="header-right">
                    <div className="company-card">
                        <div className="company-logo-frame">
                            <img 
                                src={job.logo} 
                                alt={job.company} 
                                className="company-logo"
                                onError={(e) => e.target.style.display = 'none'} 
                            />
                        </div>
                        <h3 className="company-name">{job.company}</h3>

                        <ul className="company-info">
                            <li><FiUsers className="icon" /> <span>Quy mô: {job.companySize}</span></li>
                            <li><FiCompass className="icon" /> <span>Lĩnh vực: {job.industry}</span></li>
                            <li><FiMapPin className="icon" /> <span>Địa điểm: {job.address}</span></li>
                        </ul>

                        {job.companyWebsite !== "#" && (
                            <a
                                href={job.companyWebsite}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="view-company"
                            >
                                Ghé thăm website →
                            </a>
                        )}
                    </div>
                </div>
            </header>

            {/* ===== MAIN ===== */}
            <main className="detail-job__main">
                <section className="detail-job__content">
                    <div className="section">
                        <h2>Chi tiết tuyển dụng</h2>

                        {job.tags && job.tags.length > 0 && (
                            <div className="tags">
                                {job.tags.map((tag, index) => (
                                    <span key={index} className="tag">{tag}</span>
                                ))}
                            </div>
                        )}

                        <h3 className="section-subtitle">Mô tả công việc</h3>
                        <ul className="list-disc">
                            {job.descriptionList.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>

                        <h3 className="section-subtitle">Yêu cầu ứng viên</h3>
                        <ul className="list-disc">
                            {job.requirementsList.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>

                        {job.expertiseList && job.expertiseList.length > 0 && (
                            <>
                                <h3 className="section-subtitle">Chuyên môn yêu cầu</h3>
                                <ul className="list-disc">
                                    {job.expertiseList.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </>
                        )}

                        <h3 className="section-subtitle">Quyền lợi và Đãi ngộ</h3>
                        <ul className="list-disc">
                            {job.benefitsList.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>

                        {/* Gallery ảnh */}
                        {job.images && job.images.some(img => img) && (
                            <div className="job-images">
                                <h3 className="section-subtitle">Hình ảnh văn phòng làm việc</h3>
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
                                                    alt={`Ảnh văn phòng ${index + 1}`}
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
                            <li><FiAward className="icon" /> <span><strong>Cấp bậc:</strong> {job.level}</span></li>
                            <li><FiBookOpen className="icon" /> <span><strong>Học vấn:</strong> {job.education}</span></li>
                            <li><FiUsers className="icon" /> <span><strong>Số lượng tuyển:</strong> {job.quantity}</span></li>
                            <li><FiCalendar className="icon" /> <span><strong>Ngày đăng:</strong> {job.createdAt}</span></li>
                        </ul>
                    </div>

                    <div className="sidebar-box">
                        <h3>Địa điểm làm việc</h3>
                        <p className="sidebar-address"><FiMapPin className="pin-icon" /> {job.address}</p>
                    </div>

                    <div className="sidebar-box banner-box">
                        <h3>Cách thức ứng tuyển</h3>
                        <p>Ứng viên nộp hồ sơ trực tuyến nhanh chóng bằng cách bấm vào nút dưới đây.</p>
                        <button
                            className="btn-apply-sidebar"
                            onClick={handleApplyClick}
                        >
                            Ứng tuyển ngay
                        </button>
                        <p className="deadline-note"><FiClock /> Hạn ứng tuyển: {job.deadline}</p>
                    </div>
                </aside>
            </main>

            {/* Modal xem ảnh */}
            {selectedImage && (
                <div className="image-modal" onClick={() => setSelectedImage(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close-btn" onClick={() => setSelectedImage(null)}>&times;</span>
                        <img src={selectedImage} alt="Văn phòng làm việc phóng to" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailJob;
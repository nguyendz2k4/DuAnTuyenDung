import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import ApplyModal from "./ApplyModal";
import "./detailJob.scss";

const DetailJob = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { state } = useLocation(); // Dùng nếu muốn lấy state từ trang trước
    
    // State UI
    const [selectedImage, setSelectedImage] = useState(null);
    const [openApply, setOpenApply] = useState(false);

    // State Data
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = "https://localhost:7099"; 

    const resolveUrl = (path) => {
        if (!path) return "https://via.placeholder.com/150?text=No+Image";
        const cleanPath = String(path).trim();
        if (cleanPath.startsWith("http")) return cleanPath;
        return `${API_BASE_URL}/${cleanPath.replace(/^\//, '')}`;
    };

    const parseText = (text) => {
        if (!text) return [];
        const safeText = String(text);
        // Tách theo dòng mới hoặc dấu chấm
        let items = safeText.split('\n').map(t => t.trim()).filter(t => t.length > 0);
        if (items.length <= 1) items = safeText.split('.').map(t => t.trim()).filter(t => t.length > 0);
        return items.length > 0 ? items : [safeText];
    };

    const formatDate = (dateInput) => {
        if (!dateInput) return "N/A";
        return new Date(dateInput).toLocaleDateString("vi-VN", {
            day: "2-digit", month: "2-digit", year: "numeric"
        });
    };

    useEffect(() => {
        const fetchJobDetail = async () => {
            if (!id) return;

            try {
                setLoading(true);
                setError(null);
                
                // Gọi API
                const response = await axios.get(`${API_BASE_URL}/api/DetailJobs/${id}`);
                const apiJob = response.data;

                if (apiJob) {
                    console.log("✅ Data Loaded:", apiJob);

                    // --- XỬ LÝ DỮ LIỆU (DATA TRANSFORMATION) ---
                    // Làm sạch dữ liệu ở đây để tránh tính toán lại trong JSX gây nháy
                    
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
                    // Map sang URL đầy đủ
                    const fullImages = rawImages.map(img => resolveUrl(img));

                    // 3. Xử lý Logo
                    const fullLogo = resolveUrl(apiJob.logo || apiJob.images);

                    // 4. Tạo object hoàn chỉnh
                    const finalJob = {
                        ...apiJob, // Giữ lại các trường gốc nếu cần
                        
                        // Override các trường hiển thị
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

                        // Lists (Parse ngay tại đây)
                        descriptionList: parseText(apiJob.description),
                        requirementsList: parseText(apiJob.requirements),
                        // Giả định benefits vì backend chưa có
                        benefitsList: [
                            "Môi trường làm việc chuyên nghiệp",
                            "Được đào tạo nâng cao nghiệp vụ",
                            "Chế độ bảo hiểm đầy đủ theo quy định"
                        ],
                        // Expertise (tạm lấy từ requirements)
                        expertiseList: parseText(apiJob.requirements).slice(0, 4),
                        
                        // Tags
                        tags: [
                            apiJob.categoryName,
                            apiJob.jobType,
                            apiJob.level
                        ].filter(Boolean),

                        // Gallery Images
                        images: fullImages
                    };

                    setJob(finalJob);
                } else {
                    setError("Không tìm thấy dữ liệu công việc.");
                }
            } catch (err) {
                console.error("❌ Error:", err);
                setError("Có lỗi xảy ra khi tải dữ liệu.");
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetail();
    }, [id]); // Chỉ chạy lại khi ID thay đổi

    // Các hàm xử lý sự kiện
    const handleApplyClick = () => {
        const token = localStorage.getItem("token"); 
        if (!token) {
            navigate("/login", { state: { redirectTo: `/job/${id}` } });
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

    // Render Main Content (Giữ nguyên cấu trúc HTML/Class cũ)
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
                        {/* Ảnh Logo đã được xử lý URL, thêm onError fallback */}
                        <img 
                            src={job.logo} 
                            alt={job.company} 
                            className="company-logo"
                            key={job.logo} 
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
                                                onError={(e) => e.target.style.display = 'none'} // Ẩn ngay nếu lỗi
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
                            onClick={() => setOpenApply(true)}
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
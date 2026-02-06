import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import ApplyModal from "./ApplyModal";
import "./detailJob.scss";

const DetailJob = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { state } = useLocation();
    const [selectedImage, setSelectedImage] = useState(null);
    const [openApply, setOpenApply] = useState(false);

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const API_BASE_URL = "https://localhost:7099/api/DetailJobs"; 

    useEffect(() => {
        const fetchJobDetail = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`${API_BASE_URL}/${id}`);

                console.log("✅ Job Detail Response:", response.data);

                if (response.data) {
                    const apiJob = response.data;

                    // Xử lý hạn nộp (Vì DTO chưa có Deadline, ta giả định là 30 ngày sau khi tạo)
                    const createdDate = new Date(apiJob.createdAt);
                    const deadlineDate = new Date(createdDate);
                    deadlineDate.setDate(createdDate.getDate() + 30);

                    // Xử lý Images (DTO trả về string chuỗi ảnh ngăn cách bởi dấu phẩy, cần split ra mảng)
                    let imageList = [];
                    if (apiJob.images) {
                        // Nếu backend trả về string "img1.jpg;img2.jpg" hoặc json
                        imageList = apiJob.images.includes(',') 
                            ? apiJob.images.split(',') 
                            : [apiJob.images];
                    }

                    const transformedJob = {
                        id: apiJob.jobId,
                        title: apiJob.title,
                        salary: apiJob.salaryRange, 
                        location: apiJob.location,
                        
                        // Thông tin công ty
                        company: apiJob.companyName,
                        logo: getImageUrl(apiJob.logo || apiJob.images), 
                        companySize: apiJob.companySize || "Chưa cập nhật",
                        industry: apiJob.nameIndustry || "Chưa xác định", 
                        address: apiJob.address || apiJob.location,
                        companyWebsite: apiJob.companyWebsite || "#", 
                        companyDescription: "Đang cập nhật...", 

                        // Thời gian
                        deadline: formatDate(deadlineDate),
                        createdAt: formatDate(apiJob.createdAt),

                        // Chi tiết
                        experience: apiJob.level || "Không yêu cầu kinh nghiệm",
                        level: apiJob.level || "Nhân viên",
                        education: apiJob.education || "Không yêu cầu",
                        quantity: apiJob.quantity ? `${apiJob.quantity} người` : "1 người",
                        viewCount: apiJob.viewCount || 0,

                        // Xử lý văn bản xuống dòng
                        description: parseTextToArray(apiJob.description),
                        jobRequirements: parseTextToArray(apiJob.requirements),

                        // Tags (Kết hợp Category, Type, Level)
                        tags: [
                            apiJob.categoryName,
                            apiJob.level,
                            apiJob.jobType
                        ].filter(Boolean),

                        // Tạm thời lấy requirements làm expertise vì DTO chưa có field expertise riêng
                        expertise: parseTextToArray(apiJob.requirements).slice(0, 4),

                        // Fix cứng quyền lợi (hoặc bạn cần thêm field Benefits vào DTO)
                        benefits: [
                            "Lương thưởng cạnh tranh",
                            "Môi trường làm việc chuyên nghiệp",
                            "Cơ hội thăng tiến rõ ràng"
                        ],

                        images: imageList.map(img => getImageUrl(img))
                    };

                    setJob(transformedJob);
                } else {
                    setError("Không tìm thấy công việc");
                }
            } catch (err) {
                console.error("❌ Error fetching job:", err);
                if (err.response && err.response.status === 404) {
                    setError("Tin tuyển dụng không tồn tại hoặc đã bị xóa.");
                } else {
                    setError("Lỗi kết nối đến server.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchJobDetail();
        }
    }, [id]);

    // const getImageUrl = (path) => {
    //     if (!path) return "";
    //     let p = String(path).trim();
    //     if (p.startsWith("http")) return p;

    //     const API_ROOT = "https://localhost:7099"; 

    //     if (!p.startsWith("/")) p = "/" + p;
    //     return API_ROOT + p;
    // };
    // Sửa lại hàm này trong file detailJob.jsx
const getImageUrl = (path) => {
    return "https://via.placeholder.com/150?text=No+Image"; 

};

    const formatDate = (dateInput) => {
        if (!dateInput) return "N/A";
        const date = new Date(dateInput);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };

    const parseTextToArray = (text) => {
        if (!text) return [];
        const safeText = String(text); 
        let items = safeText.split('\n').filter(line => line.trim());
        if (items.length <= 1) items = safeText.split('.').filter(line => line.trim());
        if (items.length <= 1) return [safeText];
        return items.map(item => item.trim()).filter(item => item.length > 0);
    };

    const openImageModal = (imageSrc) => {
        setSelectedImage(imageSrc);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    const handleApplyClick = () => {
        const token = localStorage.getItem("token"); 
        if (!token) {
            navigate("/login", {
                state: { redirectTo: `/job/${id}` }
            });
            return;
        }
        setOpenApply(true);
    };

    if (loading) {
        return (
            <div className="detail-job__loading">
                <div className="spinner"></div>
                <p>Đang tải thông tin công việc...</p>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="detail-job__notfound">
                <p>{error || "Không tìm thấy thông tin công việc."}</p>
                <button onClick={() => navigate(-1)}>← Quay lại</button>
            </div>
        );
    }

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
                         {/* Thêm View Count nếu muốn */}
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
                        <img src={job.logo} alt={job.company} className="company-logo" 
                             onError={(e) => e.target.src = "https://via.placeholder.com/150?text=No+Logo"} 
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
                            {job.description.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>

                        <h3>Yêu cầu</h3>
                        <ul className="list-disc">
                            {job.jobRequirements.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>

                        {/* Mục Chuyên môn */}
                        {job.expertise && job.expertise.length > 0 && (
                            <>
                                <h3>Chuyên môn (Tham khảo)</h3>
                                <ul className="list-disc">
                                    {job.expertise.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </>
                        )}

                        <h3>Quyền lợi</h3>
                        <ul className="list-disc">
                            {job.benefits.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>

                        {/* Gallery ảnh */}
                        {job.images && job.images.length > 0 && (
                            <div className="job-images">
                                <h3>Hình ảnh văn phòng</h3>
                                <div className="image-gallery">
                                    {job.images.map((image, index) => {
                                        // Bỏ qua nếu ảnh trùng với logo hoặc rỗng
                                        if(!image || image === job.logo) return null;
                                        
                                        return (
                                            <div
                                                key={index}
                                                className="gallery-item"
                                                onClick={() => openImageModal(image)}
                                            >
                                                <img
                                                    src={image}
                                                    alt={`Ảnh ${index + 1}`}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none'; // Ẩn ảnh lỗi
                                                    }}
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

            {selectedImage && (
                <div className="image-modal" onClick={closeImageModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close-btn" onClick={closeImageModal}>&times;</span>
                        <img src={selectedImage} alt="Preview" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailJob;
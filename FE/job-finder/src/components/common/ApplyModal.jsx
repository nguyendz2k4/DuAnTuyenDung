import React, { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import applicationService from "../../services/applicationService";
import "./ApplyModal.scss";

export default function ApplyModal({ open, onClose, job }) {
    const { user } = useAuth();
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        location: "",
        cover_letter: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const locations = useMemo(() => {
        if (!job || !job.location) return [];
        return job.location.split(',').map(loc => loc.trim());
    }, [job]);

    if (!open || !job) return null;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!file) return alert("Vui lòng tải lên CV!");
        if (!formData.full_name || !formData.email || !formData.phone || !formData.location) {
            return alert("Vui lòng điền đầy đủ các thông tin bắt buộc (*)");
        }

        setIsSubmitting(true);
        try {
            const data = new FormData();
            data.append('job_id', job.job_id || job.id || job.jobId);
            data.append('full_name', formData.full_name);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            data.append('location', formData.location);
            data.append('cover_letter', formData.cover_letter);
            data.append('cv_file', file);

            // Lấy user_id từ AuthContext
            if (user?.id || user?.user_id) {
                data.append('user_id', user.id || user.user_id);
            }

            const response = await applicationService.applyJob(data);

            if (response.success) {
                alert("Chúc mừng! Bạn đã nộp hồ sơ thành công.");
                onClose();
                setFile(null);
                setFormData({
                    full_name: "",
                    email: "",
                    phone: "",
                    location: "",
                    cover_letter: ""
                });
            } else {
                alert("Lỗi: " + (response.message || "Có lỗi xảy ra"));
            }

        } catch (error) {
            console.error("Lỗi ứng tuyển:", error);
            alert("Có lỗi xảy ra khi kết nối server.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="apply-modal-overlay">
            <div className="apply-modal-container">
                <div className="modal-header">
                    <h2 className="job-title">
                        Ứng tuyển <span className="highlight">{job.title}</span>
                    </h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="cv-upload-group">
                        <div className="upload-header">
                            <span className="icon-folder">📂</span> Chọn CV để ứng tuyển
                        </div>

                        <div className="upload-area">
                            <div className="upload-instruction">
                                <div className="cloud-icon">☁️</div>
                                <span style={{ fontWeight: file ? 'bold' : 'normal', color: file ? '#00b14f' : '#333' }}>
                                    {file ? `Đã chọn: ${file.name}` : "Tải lên CV từ máy tính, chọn hoặc kéo thả"}
                                </span>
                                <p>Hỗ trợ định dạng .doc, .docx, pdf có kích thước dưới 5MB</p>
                            </div>

                            <label className="btn-select-cv">
                                Chọn CV
                                <input
                                    type="file"
                                    hidden
                                    accept=".doc,.docx,.pdf"
                                    onChange={handleFileChange}
                                    onClick={(e) => { e.target.value = null }}
                                />
                            </label>
                        </div>

                        <div className="info-form">
                            <div className="form-note">
                                <span className="text-green">Vui lòng nhập đầy đủ thông tin chi tiết:</span>
                                <span className="text-red">(*) Thông tin bắt buộc.</span>
                            </div>

                            <div className="form-group">
                                <label>Họ và tên <span className="required">*</span></label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    placeholder="Họ tên hiển thị với NTD"
                                />
                            </div>

                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <label>Email <span className="required">*</span></label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Email hiển thị với NTD"
                                        />
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label>Số điện thoại <span className="required">*</span></label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Số điện thoại hiển thị với NTD"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Địa điểm làm việc mong muốn <span className="required">*</span></label>
                                <select name="location" value={formData.location} onChange={handleChange}>
                                    <option value="" disabled>Chọn địa điểm bạn muốn làm việc</option>
                                    {locations.length > 0 ? (
                                        locations.map((loc, idx) => (
                                            <option key={idx} value={loc}>{loc}</option>
                                        ))
                                    ) : (
                                        <option value="Văn phòng">Văn phòng công ty</option>
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="cover-letter-section">
                        <h3 className="section-title"><span className="icon-leaf">🍃</span> Thư giới thiệu:</h3>
                        <p className="description">Một thư giới thiệu ngắn gọn, chỉn chu sẽ giúp bạn trở nên chuyên nghiệp...</p>
                        <div className="textarea-wrapper">
                            <textarea
                                name="cover_letter"
                                value={formData.cover_letter}
                                onChange={handleChange}
                                placeholder="Viết giới thiệu ngắn gọn về bản thân..."
                                rows={4}
                            ></textarea>
                            <span className="edit-icon">✎</span>
                        </div>
                    </div>

                    <div className="warning-box">
                        <h4 className="warning-title">⚠️ Lưu ý:</h4>
                        <ol>
                            <li>TopCV khuyên tất cả các bạn hãy luôn cẩn trọng...</li>
                            <li>Tìm hiểu thêm kinh nghiệm phòng tránh lừa đảo <a href="#">tại đây</a>.</li>
                        </ol>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose} disabled={isSubmitting}>Hủy</button>
                    <button
                        className="btn-submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        style={{ opacity: isSubmitting ? 0.7 : 1 }}
                    >
                        {isSubmitting ? "Đang xử lý..." : "Nộp hồ sơ ứng tuyển"}
                    </button>
                </div>
            </div>
        </div>
    );
}
import { useState } from "react";
import { BsChevronRight } from "react-icons/bs";
import "./JoblistDropdown.scss";

const jobCategories = [
    {
        group: "Kinh doanh/Bán hàng",
        jobs: ["Nhân viên kinh doanh", "Trưởng nhóm bán hàng"],
    },
    {
        group: "Marketing/PR/Quảng cáo",
        jobs: ["Digital Marketing", "SEO/Content Marketing"],
    },
    {
        group: "Nhân sự/Hành chính/Pháp chế",
        jobs: ["Nhân sự", "Hành chính", "Pháp chế"],
        specialties: [
            "Tuyển dụng",
            "Đào tạo",
            "Quan hệ lao động",
            "HRBP",
            "C&B (Lương/Thưởng/Phúc lợi)",
            "Nhân sự tổng hợp",
            "Trưởng phòng nhân sự",
            "Giám đốc nhân sự",
            "Chuyên môn Nhân sự khác",
        ],
    },
    {
        group: "Công nghệ thông tin",
        jobs: ["Frontend Developer", "Backend Developer", "Tester"],
    },
];

export default function JoblistDropdown({ onClose }) {
    const [selectedGroup, setSelectedGroup] = useState(null);

    const selectedCategory = jobCategories.find(
        (cat) => cat.group === selectedGroup
    );

    return (
        <div className="joblist-dropdown">
            <div className="dropdown-content">
                {/* Cột nhóm nghề */}
                <div className="column group-column">
                    {jobCategories.map((cat) => (
                        <div
                            key={cat.group}
                            className={`group-item ${selectedGroup === cat.group ? "active" : ""}`}
                            onClick={() => setSelectedGroup(cat.group)}
                        >
                            {cat.group}
                            <BsChevronRight size={14} className="arrow-icon" />
                        </div>
                    ))}
                </div>

                {/* Cột nghề và chuyên môn */}
                <div className="column detail-column">
                    {selectedCategory ? (
                        <>
                            {selectedCategory.jobs.map((job) => (
                                <div key={job} className="job-section">
                                    <p className="job-title">{job}</p>
                                    <div className="specialties">
                                        {(selectedCategory.specialties || []).map((sp) => (
                                            <span key={sp} className="tag">
                                                {sp}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <p className="placeholder">Chọn một nhóm nghề ở bên trái</p>
                    )}
                </div>
            </div>

            {/* Nút hành động */}
            <div className="dropdown-footer">
                <button className="btn cancel" onClick={onClose}>
                    Hủy
                </button>
                <button className="btn confirm" onClick={onClose}>
                    Chọn
                </button>
            </div>
        </div>
    );
}

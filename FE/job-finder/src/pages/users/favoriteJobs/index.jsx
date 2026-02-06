import { useEffect, useState } from "react";
import { useFavorite } from "../Context/FavoriteContext";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import axios from "axios";
import logo1 from "../../../assets/imgs/logo_cty/conca.jpg";
import "./style.scss";

// Cấu hình URL giống bên HomePage
const API_BASE_URL = "https://localhost:7099"; 

const FavoriteJobs = () => {
    const { favorites, toggleFavorite } = useFavorite();
    const [favoriteJobsList, setFavoriteJobsList] = useState([]);
    const [loading, setLoading] = useState(true);

    // Hàm lấy ảnh chuẩn từ .NET
    const getImageUrl = (imagePath) => {
        if (!imagePath) return logo1;
        if (imagePath.startsWith('http')) return imagePath;
        // Trỏ về thư mục ảnh của .NET
        return `${API_BASE_URL}/images/companies/${imagePath}`; 
    };

    useEffect(() => {
        const fetchFavoriteJobs = async () => {
            // Nếu danh sách ID rỗng thì dừng luôn
            if (favorites.length === 0) {
                setFavoriteJobsList([]);
                setLoading(false);
                return;
            }

            try {
                // GỌI API .NET (Lấy danh sách job về để lọc)
                // Lưu ý: Cách tối ưu hơn là viết API backend nhận vào mảng ID, 
                // nhưng tạm thời ta lấy list về lọc client cho nhanh.
                const response = await axios.get(`${API_BASE_URL}/api/jobs?limit=100`);

                if (response.data?.success) {
                    const allJobs = response.data.data;

                    // 1. Map dữ liệu từ .NET sang format của React
                    const formattedJobs = allJobs.map(job => ({
                        id: job.jobId,          // Quan trọng: map jobId -> id
                        title: job.title,
                        company: job.companyName, // Quan trọng: map companyName -> company
                        logo: job.companyLogo,
                        salary: job.salaryRange,
                        location: job.location,
                        isPro: job.isPro
                    }));

                    // 2. Lọc những job có ID nằm trong danh sách yêu thích
                    const filtered = formattedJobs.filter(job => favorites.includes(job.id));
                    
                    setFavoriteJobsList(filtered);
                }
            } catch (err) {
                console.error("Lỗi khi tải danh sách yêu thích:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFavoriteJobs();
    }, [favorites]); 

    if (loading) {
        return (
            <div className="favorite-jobs-page">
                 {/* Tận dụng cái loading spinner đẹp bạn vừa làm */}
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="favorite-jobs-page">
            <h1 className="page-title">Việc làm đã lưu ({favorites.length})</h1>

            {favoriteJobsList.length === 0 ? (
                <div className="empty-state">
                    <p>Bạn chưa lưu việc làm nào hoặc bài đăng đã bị xóa.</p>
                    <Link to="/" className="back-home-btn">
                        Về trang chủ
                    </Link>
                </div>
            ) : (
                <div className="job-list">
                    {favoriteJobsList.map((job, index) => (
                        <div 
                            key={job.id} 
                            className={`job-card ${job.isPro ? "card-pro" : ""}`}
                            // Thêm hiệu ứng trồi lên y hệt trang chủ
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="job-logo">
                                <img
                                    src={getImageUrl(job.logo)}
                                    alt={job.company}
                                    onError={(e) => { e.target.src = logo1; }}
                                />
                            </div>

                            <div className="job-info">
                                <h3 className="job-title">
                                    <Link to={`/job/${job.id}`}>{job.title}</Link>
                                </h3>
                                <p className="company-name">
                                    {job.isPro && <span className="label-pro">PRO</span>} {job.company}
                                </p>
                                <div className="job-meta">
                                    <span className="salary">{job.salary}</span>
                                    <span className="location">{job.location}</span>
                                </div>
                            </div>

                            <button
                                className="save-icon active"
                                onClick={() => toggleFavorite(job.id)}
                            >
                                <FaHeart size={20} color="#00b14f" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoriteJobs;
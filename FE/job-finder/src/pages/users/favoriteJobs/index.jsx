import { useEffect, useState } from "react";
import { useFavorite } from "../../../context/FavoriteContext";
import { Link } from "react-router-dom";
import JobCard from "../../../components/common/JobCard";
import jobService from "../../../services/jobService";
import { ROUTES } from "../../../utils/router";
import "./style.scss";

const FavoriteJobs = () => {
    const { favorites, toggleFavorite } = useFavorite();
    const [favoriteJobsList, setFavoriteJobsList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavoriteJobs = async () => {
            // Nếu danh sách ID rỗng thì dừng luôn
            if (favorites.length === 0) {
                setFavoriteJobsList([]);
                setLoading(false);
                return;
            }

            try {
                const res = await jobService.getJobs({ limit: 100 });

                if (res?.success) {
                    const allJobs = res.data;

                    // Map dữ liệu từ .NET sang format của React
                    const formattedJobs = allJobs.map(job => ({
                        id: job.jobId,
                        title: job.title,
                        company: job.companyName,
                        logo: job.companyLogo,
                        salary: job.salaryRange,
                        location: job.location,
                        isPro: job.isPro,
                    }));

                    // Lọc những job có ID nằm trong danh sách yêu thích
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
                    <Link to={ROUTES.USER.HOME} className="back-home-btn">
                        Về trang chủ
                    </Link>
                </div>
            ) : (
                <div className="job-list">
                    {favoriteJobsList.map((job, index) => (
                        <JobCard
                            key={job.id}
                            job={job}
                            isLiked={true}
                            onToggleLike={toggleFavorite}
                            style={{ animationDelay: `${index * 0.08}s` }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoriteJobs;
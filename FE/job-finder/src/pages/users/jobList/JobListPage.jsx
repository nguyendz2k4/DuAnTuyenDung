import React, { useState, useEffect } from 'react';
import jobService from '../../../services/jobService';

function JobListPage() {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [currentPage, setCurrentPage] = useState(1);
  const [location, setLocation] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  // Fetch jobs khi component mount hoặc filters thay đổi
  useEffect(() => {
    fetchJobs();
  }, [currentPage, location, searchKeyword]);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await jobService.getJobs({
        page: currentPage,
        limit: 12,
        location: location,
        search: searchKeyword,
      });

      console.log('Jobs data:', result);

      if (result.success) {
        setJobs(result.data);
        setPagination(result.pagination);
      }
    } catch (err) {
      setError('Không thể tải danh sách công việc. Vui lòng thử lại!');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handler cho search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); 
    fetchJobs();
  };

  // Handler cho pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="job-list-page">
      {/* Search Form */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Tìm kiếm công việc..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">Tất cả địa điểm</option>
          <option value="Hà Nội">Hà Nội</option>
          <option value="Hồ Chí Minh">Hồ Chí Minh</option>
          <option value="Đà Nẵng">Đà Nẵng</option>
        </select>
        <button type="submit">Tìm kiếm</button>
      </form>

      {/* Loading */}
      {loading && <div>Đang tải...</div>}

      {/* Error */}
      {error && <div className="error">{error}</div>}

      {/* Jobs List */}
      {!loading && !error && (
        <>
          <div className="jobs-grid">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job.jobId} className="job-card">
                  <img src={job.companyLogo || '/default-logo.png'} alt={job.companyName} />
                  <h3>{job.title}</h3>
                  <p>{job.companyName}</p>
                  <p>{job.location}</p>
                  <p>{job.salaryRange}</p>
                  {job.isPro && <span className="pro-badge">PRO</span>}
                </div>
              ))
            ) : (
              <div>Không tìm thấy công việc nào</div>
            )}
          </div>

          {/* Pagination */}
          {pagination.total_pages > 1 && (
            <div className="pagination">
              <button
                disabled={!pagination.has_prev}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Trước
              </button>

              <span>
                Trang {pagination.current_page} / {pagination.total_pages}
              </span>

              <button
                disabled={!pagination.has_next}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default JobListPage;

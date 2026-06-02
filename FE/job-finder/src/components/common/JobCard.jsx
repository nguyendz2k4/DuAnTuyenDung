import React, { memo } from "react";
import { Link } from "react-router-dom";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { getImageUrl, logo_default } from "../../utils/imageUtils";
import "./JobCard.scss";

const JobCard = ({ job, isLiked, onToggleLike, style = {} }) => {
  return (
    <div className={`job-card-premium ${job.isPro ? "is-pro-tier" : ""}`} style={style}>
      {/* Premium Gradient bar for PRO tiers */}
      {job.isPro && <div className="card-pro-stripe"></div>}

      <div className="card-body">
        {/* Company Logo Wrapper */}
        <div className="company-logo-wrapper">
          <img
            src={getImageUrl(job.logo)}
            alt={job.company}
            onError={(e) => {
              e.target.src = logo_default;
            }}
          />
        </div>

        {/* Job Information */}
        <div className="job-details-wrapper">
          <h3 className="job-headline">
            <Link to={`/job/${job.id}`}>{job.title}</Link>
          </h3>
          
          <div className="company-meta-row">
            {job.isPro && <span className="premium-pro-badge">PRO</span>}
            <span className="company-name-text">{job.company}</span>
          </div>

          <div className="job-tags-row">
            <span className="tag-pill salary-pill">{job.salary}</span>
            <span className="tag-pill location-pill">{job.location}</span>
          </div>
        </div>

        {/* Favorite/Save Toggle Button */}
        <button
          className={`favorite-action-btn ${isLiked ? "is-active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleLike(job.id);
          }}
          aria-label={isLiked ? "Bỏ lưu việc làm" : "Lưu việc làm"}
        >
          {isLiked ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
        </button>
      </div>
    </div>
  );
};

export default memo(JobCard);

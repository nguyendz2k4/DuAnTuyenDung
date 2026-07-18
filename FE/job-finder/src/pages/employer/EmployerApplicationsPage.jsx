import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import applicationService from "../../services/applicationService";

export default function EmployerApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const employerId = user?.id || user?.userId || user?.user_id;

  const loadApplications = useCallback(async () => {
    if (!employerId) return;
    setLoading(true);
    try {
      const response = await applicationService.getEmployerApplications(employerId);
      const payload = response?.data ?? response;
      setApplications(payload?.data || payload || []);
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [employerId]);

  useEffect(() => { loadApplications(); }, [loadApplications]);

  const updateStatus = async (applicationId, status) => {
    await applicationService.updateEmployerApplicationStatus(applicationId, status);
    loadApplications();
  };

  return (
    <section>
      <div className="employer-page__heading"><h1>Quản lý ứng viên</h1><p>Xem và phản hồi các hồ sơ ứng tuyển vào tin của bạn.</p></div>
      <div className="employer-list">
        {loading ? <div className="employer-card">Đang tải hồ sơ...</div> : applications.length === 0 ? <div className="employer-card">Chưa có hồ sơ ứng tuyển nào.</div> : applications.map((application) => (
          <article className="employer-card employer-application" key={application.application_id}>
            <div><h3>{application.full_name}</h3><p>{application.job_title} · {application.email}</p></div>
            <div><span className="employer-status">{application.status || "pending"}</span>{application.status === "pending" && <><button className="employer-button" type="button" onClick={() => updateStatus(application.application_id, "approved")}>Chấp nhận</button><button className="employer-button employer-button--secondary" type="button" onClick={() => updateStatus(application.application_id, "rejected")}>Từ chối</button></>}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

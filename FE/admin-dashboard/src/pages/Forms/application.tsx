import React, { useState, useEffect } from 'react';

export default function EmployerApplicationsManager() {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const API_BASE = 'http://localhost/DuAnWebTuyenDung/BE/admin';

  const getEmployer = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return {
        user_id: user.user_id || 7,
        employer_id: user.employer_id || 3
      };
    } catch {
      return { user_id: 7, employer_id: 3 };
    }
  };

  const employer = getEmployer();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/get-applications.php?employer_id=${employer.employer_id}`
      );
      const data = await response.json();
      if (data.success) {
        setApplications(data.data);
      }
    } catch (error) {
      console.error('Lỗi tải danh sách ứng viên:', error);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      const response = await fetch(`${API_BASE}/update-application-status.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application_id: applicationId, status })
      });

      const data = await response.json();
      if (data.success) {
        alert('Cập nhật trạng thái thành công!');
        fetchApplications();
      }
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái:', error);
      alert('Có lỗi xảy ra khi cập nhật');
    }
  };

  const openChat = async (application) => {
    setSelectedApp(application);
    setShowChat(true);

    const seekerId = application.seeker_id || 2;

    try {
      const response = await fetch(
        `${API_BASE}/messaging.php?user1=${employer.user_id}&user2=${seekerId}`
      );
      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('Lỗi tải tin nhắn:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const seekerId = selectedApp.seeker_id || 2;

      const response = await fetch(`${API_BASE}/messaging.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: employer.user_id,
          receiver_id: seekerId,
          content: newMessage,
          application_id: selectedApp.application_id
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessages([...messages, {
          sender_id: employer.user_id,
          receiver_id: seekerId,
          content: newMessage,
          created_at: new Date().toISOString()
        }]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Lỗi gửi tin nhắn:', error);
      alert('Có lỗi khi gửi tin nhắn');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Chờ xử lý' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Đã chấp nhận' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Đã từ chối' },
      responded: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Đã phản hồi' }
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const filteredApps = filterStatus === 'all'
    ? applications
    : applications.filter(app => app.status === filterStatus);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Quản lý ứng viên</h1>
          <p className="text-gray-600">Tổng số hồ sơ: {applications.length}</p>
        </div>

        {/* Bộ lọc */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'all', label: 'Tất cả' },
              { value: 'pending', label: 'Chờ xử lý' },
              { value: 'approved', label: 'Đã chấp nhận' },
              { value: 'rejected', label: 'Đã từ chối' },
              { value: 'responded', label: 'Đã phản hồi' }
            ].map(filter => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterStatus === filter.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Danh sách ứng viên */}
        <div className="grid gap-4">
          {filteredApps.map(app => (
            <div key={app.application_id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{app.full_name}</h3>
                  <p className="text-sm text-gray-600 mt-1">Ứng tuyển: <span className="font-medium">{app.job_title}</span></p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    <span>📧 {app.email}</span>
                    <span>📱 {app.phone}</span>
                    <span>📍 {app.location}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(app.status)}
                  <span className="text-xs text-gray-500">
                    {new Date(app.applied_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>

              {app.cover_letter && (
                <div className="bg-gray-50 rounded p-3 mb-4">
                  <p className="text-sm text-gray-700"><strong>Thư giới thiệu:</strong> {app.cover_letter}</p>
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                {app.cv_path && (
                  <a
                    href={`http://localhost/DuAnWebTuyenDung${app.cv_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                  >
                    📄 Xem CV
                  </a>
                )}

                <button
                  onClick={() => openChat(app)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
                >
                  💬 Nhắn tin
                </button>

                {app.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateStatus(app.application_id, 'approved')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                    >
                      ✓ Chấp nhận
                    </button>
                    <button
                      onClick={() => updateStatus(app.application_id, 'rejected')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                    >
                      ✗ Từ chối
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {filteredApps.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-500">Chưa có ứng viên nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Chat */}
      {showChat && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{selectedApp.full_name}</h3>
                <p className="text-sm text-gray-600">{selectedApp.job_title}</p>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender_id === employer.user_id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender_id === employer.user_id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                        }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {new Date(msg.created_at).toLocaleTimeString('vi-VN')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !newMessage.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? '...' : 'Gửi'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
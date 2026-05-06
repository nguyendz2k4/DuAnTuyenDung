import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import notificationService from '../../services/notificationService';
import { formatTime, getNotificationIcon } from '../../utils/formatters';
import type { NotificationItem } from '../../types/api';

export default function EmployerNotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  const userId = user?.userId ? parseInt(user.userId) : 0;

  // Load thông báo khi component mount và mỗi 30 giây
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    try {
      const { data } = await notificationService.getNotifications(userId);
      if (data.success) {
        setNotifications(data.data);
        setUnreadCount(data.unread_count);
      }
    } catch (error) {
      console.error('Lỗi tải thông báo:', error);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (notificationId: number) => {
    try {
      const response = await notificationService.markAsRead(userId, notificationId);
      if (response.status === 200) {
        setNotifications(notifications.map(n =>
          n.notification_id === notificationId ? { ...n, is_read: 1 } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Lỗi đánh dấu đã đọc:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await notificationService.markAllAsRead(userId);
      if (response.status === 200) {
        setNotifications(notifications.map(n => ({ ...n, is_read: 1 })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Lỗi đánh dấu tất cả:', error);
    }
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    if (!notification.is_read) {
      markAsRead(notification.notification_id);
    }

    if (notification.type === 'new_application') {
      window.location.href = '/application';
    } else if (notification.type === 'new_message') {
      window.location.href = '/application';
    }

    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchNotifications();
    }
  };

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100"
        onClick={toggleDropdown}
      >
        {unreadCount > 0 && (
          <span className="absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400">
            <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
          </span>
        )}
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute -right-[240px] lg:right-0 mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-lg z-50 sm:w-[361px]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h5 className="text-lg font-semibold text-gray-800">
                  Thông báo
                </h5>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium text-white bg-orange-500 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Đọc tất cả
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 transition hover:text-gray-700"
                >
                  <svg
                    className="fill-current"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <ul className="flex flex-col h-auto overflow-y-auto">
              {notifications.length === 0 ? (
                <li className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <svg
                    className="w-16 h-16 mb-3 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <p className="text-sm">Chưa có thông báo nào</p>
                </li>
              ) : (
                notifications.map((notif) => (
                  <li key={notif.notification_id}>
                    <button
                      onClick={() => handleNotificationClick(notif)}
                      className={`flex gap-3 w-full text-left rounded-lg border-b border-gray-100 p-3 px-4 py-3 hover:bg-gray-50 transition ${!notif.is_read ? 'bg-blue-50' : ''
                        }`}
                    >
                      <span className="flex-shrink-0 text-2xl">
                        {getNotificationIcon(notif.type)}
                      </span>

                      <span className="flex-1 min-w-0">
                        <span className="block mb-1 text-sm font-medium text-gray-800">
                          {notif.title}
                        </span>
                        <span className="block mb-2 text-xs text-gray-600 line-clamp-2">
                          {notif.content}
                        </span>
                        <span className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{formatTime(notif.created_at)}</span>
                          {!notif.is_read && (
                            <>
                              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                              <span className="text-blue-600 font-medium">Mới</span>
                            </>
                          )}
                        </span>
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>

            {notifications.length > 0 && (
              <button
                onClick={() => {
                  window.location.href = '/notifications';
                  setIsOpen(false);
                }}
                className="block w-full px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Xem tất cả thông báo
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
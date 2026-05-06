import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import notificationService from '../../services/notificationService';
import { formatTimeDetailed, getNotificationIcon } from '../../utils/formatters';
import type { NotificationItem } from '../../types/api';

export default function AllNotificationsPage() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const { user } = useAuth();

    const userId = user?.userId ? parseInt(user.userId) : 0;

    const fetchNotifications = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const unreadOnly = filter === 'unread';
            const { data } = await notificationService.getNotifications(userId, 100, unreadOnly);

            if (data.success) {
                let filteredData = data.data;
                if (filter === 'read') {
                    filteredData = data.data.filter((n: NotificationItem) => n.is_read === 1);
                }
                setNotifications(filteredData);
                setUnreadCount(data.unread_count);
            }
        } catch (error) {
            console.error('Lỗi tải thông báo:', error);
        } finally {
            setLoading(false);
        }
    }, [userId, filter]);

    useEffect(() => {
        fetchNotifications();
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
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Thông báo</h1>
                            <p className="text-gray-600 mt-1">
                                {unreadCount > 0 && `Bạn có ${unreadCount} thông báo chưa đọc`}
                            </p>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                            >
                                Đánh dấu tất cả đã đọc
                            </button>
                        )}
                    </div>

                    {/* Bộ lọc */}
                    <div className="flex gap-2">
                        {[
                            { value: 'all', label: 'Tất cả' },
                            { value: 'unread', label: 'Chưa đọc' },
                            { value: 'read', label: 'Đã đọc' }
                        ].map(f => (
                            <button
                                key={f.value}
                                onClick={() => setFilter(f.value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === f.value
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {f.label}
                                {f.value === 'unread' && unreadCount > 0 && (
                                    <span className="ml-2 px-2 py-0.5 text-xs bg-white text-blue-600 rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Danh sách thông báo */}
                <div className="space-y-3">
                    {loading ? (
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-600 mt-3">Đang tải...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                            <svg
                                className="w-16 h-16 mx-auto mb-4 text-gray-300"
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
                            <p className="text-gray-500">Không có thông báo nào</p>
                        </div>
                    ) : (
                        notifications.map((notif) => (
                            <button
                                key={notif.notification_id}
                                onClick={() => handleNotificationClick(notif)}
                                className={`w-full bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition text-left ${!notif.is_read ? 'border-l-4 border-blue-500' : ''
                                    }`}
                            >
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 text-3xl">
                                        {getNotificationIcon(notif.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <h3 className="font-semibold text-gray-800 text-base">
                                                {notif.title}
                                            </h3>
                                            {!notif.is_read && (
                                                <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 text-sm mb-3">
                                            {notif.content}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span>{formatTimeDetailed(notif.created_at)}</span>
                                            {!notif.is_read && (
                                                <>
                                                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                                    <span className="text-blue-600 font-medium">Mới</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
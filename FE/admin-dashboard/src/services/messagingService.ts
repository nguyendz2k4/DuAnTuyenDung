import api from "./apiConfig";

const messagingService = {
  /**
   * Lấy lịch sử tin nhắn giữa 2 users
   */
  getMessages: (user1: number, user2: number) => {
    return api.get("/api/admin/messages", { params: { user1, user2 } });
  },

  /**
   * Gửi tin nhắn
   */
  sendMessage: (data: {
    sender_id: number;
    receiver_id: number;
    content: string;
    application_id: number;
  }) => {
    return api.post("/api/admin/messages", data);
  },
};

export default messagingService;

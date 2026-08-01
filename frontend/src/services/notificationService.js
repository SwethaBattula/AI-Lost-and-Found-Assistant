import api from './api';

export const notificationService = {
  async getNotifications() {
    const response = await api.get('/notifications/');
    return response.data;
  },
};

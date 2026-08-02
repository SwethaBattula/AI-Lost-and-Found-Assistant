import api from './api';

export const adminService = {
  async getStats() {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  async getMatches() {
    const response = await api.get('/admin/matches');
    return response.data;
  },

  async approveMatch(matchId) {
    const response = await api.put(`/admin/matches/${matchId}/approve`);
    return response.data;
  },

  async markHandover(matchId) {
    const response = await api.put(`/admin/matches/${matchId}/handover`);
    return response.data;
  },

  async rejectMatch(matchId) {
    const response = await api.put(`/admin/matches/${matchId}/reject`);
    return response.data;
  },

  async getInventory() {
    const response = await api.get('/admin/inventory');
    return response.data;
  },

  async getUsers() {
    const response = await api.get('/admin/users');
    return response.data;
  },
};

import api from './api';

export const matchService = {
  async getMatches(minConfidence = 0.0, statusFilter = null) {
    const params = {};
    if (minConfidence > 0) params.min_confidence = minConfidence;
    if (statusFilter) params.status_filter = statusFilter;

    const response = await api.get('/matches/', { params });
    return response.data;
  },

  async getMatch(id) {
    const response = await api.get(`/matches/${id}`);
    return response.data;
  },

  async updateMatchStatus(id, status) {
    const response = await api.put(`/matches/${id}/status`, { status });
    return response.data;
  },

  async triggerMatching() {
    const response = await api.post('/matches/trigger-matching');
    return response.data;
  },
};

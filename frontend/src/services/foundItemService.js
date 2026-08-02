import api from './api';

export const foundItemService = {
  async getFoundItems(myItemsOnly = false) {
    const response = await api.get('/found-items/', {
      params: { my_items_only: myItemsOnly },
    });
    return response.data;
  },

  async getFoundItem(id) {
    const response = await api.get(`/found-items/${id}`);
    return response.data;
  },

  async createFoundItem(formData) {
    // formData is FormData object containing item_name, category, description, date_found, location, and optional image
    const response = await api.post('/found-items/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async markReceived(id) {
    const response = await api.put(`/found-items/${id}/mark-received`);
    return response.data;
  },

  async updateFoundItem(id, data) {
    const response = await api.put(`/found-items/${id}`, data);
    return response.data;
  },

  async deleteFoundItem(id) {
    const response = await api.delete(`/found-items/${id}`);
    return response.data;
  },
};

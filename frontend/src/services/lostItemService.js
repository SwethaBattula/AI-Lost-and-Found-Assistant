import api from './api';

export const lostItemService = {
  async getLostItems(myItemsOnly = false) {
    const response = await api.get('/lost-items/', {
      params: { my_items_only: myItemsOnly },
    });
    return response.data;
  },

  async getLostItem(id) {
    const response = await api.get(`/lost-items/${id}`);
    return response.data;
  },

  async createLostItem(formData) {
    // formData is FormData object containing item_name, category, description, date_lost, location, and optional image
    const response = await api.post('/lost-items/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateLostItem(id, data) {
    const response = await api.put(`/lost-items/${id}`, data);
    return response.data;
  },

  async deleteLostItem(id) {
    const response = await api.delete(`/lost-items/${id}`);
    return response.data;
  },
};

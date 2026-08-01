import React, { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, X, AlertCircle } from 'lucide-react';

const CATEGORIES = [
  'Wallets & Cards',
  'Electronics & Phones',
  'Keys & Badges',
  'Bags & Luggage',
  'Jewelry & Watches',
  'Clothing & Eyewear',
  'Documents & ID',
  'Other',
];

const ItemForm = ({
  initialValues = null,
  type = 'lost', // 'lost' or 'found'
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    item_name: '',
    category: CATEGORIES[0],
    description: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      const dateVal = initialValues.date_lost || initialValues.date_found;
      setFormData({
        item_name: initialValues.item_name || '',
        category: initialValues.category || CATEGORIES[0],
        description: initialValues.description || '',
        date: dateVal ? new Date(dateVal).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        location: initialValues.location || '',
      });
      if (initialValues.image_path) {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
        const fullUrl = `${baseUrl}${initialValues.image_path.startsWith('/') ? '' : '/'}${initialValues.image_path}`;
        setImagePreview(fullUrl);
      }
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase();
      if (!['jpg', 'jpeg', 'png'].includes(ext)) {
        setErrors((prev) => ({ ...prev, image: 'Only JPG, JPEG, and PNG images are allowed.' }));
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: null }));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.item_name.trim()) newErrors.item_name = 'Item name is required.';
    if (!formData.description.trim()) newErrors.description = 'Description is required.';
    if (!formData.location.trim()) newErrors.location = 'Location is required.';
    if (!formData.date) newErrors.date = 'Date is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (initialValues) {
      // Editing existing item (pass plain object)
      const payload = {
        item_name: formData.item_name,
        category: formData.category,
        description: formData.description,
        location: formData.location,
      };
      if (type === 'lost') {
        payload.date_lost = new Date(formData.date).toISOString();
      } else {
        payload.date_found = new Date(formData.date).toISOString();
      }
      onSubmit(payload);
    } else {
      // Creating new item (pass FormData)
      const payload = new FormData();
      payload.append('item_name', formData.item_name);
      payload.append('category', formData.category);
      payload.append('description', formData.description);
      payload.append('location', formData.location);

      if (type === 'lost') {
        payload.append('date_lost', new Date(formData.date).toISOString());
      } else {
        payload.append('date_found', new Date(formData.date).toISOString());
      }

      if (imageFile) {
        payload.append('image', imageFile);
      }

      onSubmit(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Item Name */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Item Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="item_name"
          value={formData.item_name}
          onChange={handleChange}
          placeholder="e.g., Black Leather Bifold Wallet, iPhone 14 Pro"
          className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none transition text-sm"
        />
        {errors.item_name && (
          <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.item_name}</span>
          </p>
        )}
      </div>

      {/* Category & Date Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Category <span className="text-red-400">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-white outline-none transition text-sm"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            {type === 'lost' ? 'Date Lost' : 'Date Found'} <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-white outline-none transition text-sm"
          />
          {errors.date && (
            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.date}</span>
            </p>
          )}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {type === 'lost' ? 'Location Lost' : 'Location Found'} <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g., Central Park Bench near 5th Ave, Main Campus Library 2nd Floor"
          className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none transition text-sm"
        />
        {errors.location && (
          <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.location}</span>
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Detailed Description <span className="text-red-400">*</span>
        </label>
        <textarea
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe distinctive markings, color, brand, condition, unique scratches, contents, etc."
          className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl p-4 text-white placeholder-slate-500 outline-none transition text-sm resize-none"
        ></textarea>
        {errors.description && (
          <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.description}</span>
          </p>
        )}
      </div>

      {/* Image Upload Dropzone (New items only) */}
      {!initialValues && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Upload Image <span className="text-slate-500">(Optional: JPG, JPEG, PNG)</span>
          </label>

          {imagePreview ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 h-56 flex items-center justify-center">
              <img src={imagePreview} alt="Uploaded item preview" className="h-full w-auto object-contain" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-3 right-3 p-2 bg-slate-900/80 hover:bg-slate-800 text-white rounded-full transition border border-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-slate-800 hover:border-blue-500/60 rounded-2xl cursor-pointer bg-slate-950/60 hover:bg-slate-950 transition group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                <Upload className="w-8 h-8 text-slate-500 group-hover:text-blue-400 transition mb-2" />
                <p className="text-sm font-medium text-slate-300">Click to upload photo of item</p>
                <p className="text-xs text-slate-500 mt-1">Supports PNG, JPG, JPEG</p>
              </div>
              <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleImageChange} className="hidden" />
            </label>
          )}

          {errors.image && (
            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.image}</span>
            </p>
          )}
        </div>
      )}

      {/* Submit Controls */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition text-sm"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition text-sm shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center space-x-2"
        >
          {loading ? 'Saving...' : initialValues ? 'Update Item' : type === 'lost' ? 'Submit Lost Report' : 'Submit Found Report'}
        </button>
      </div>
    </form>
  );
};

export default ItemForm;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiFilter, FiPlus, FiEdit, FiTrash2, FiEye, FiGrid, FiList } from 'react-icons/fi';
import { toast } from 'react-toastify';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get('/api/categories', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const processedCategories = response.data.map(category => ({
          id: category.id,
          name: category.name,
          description: category.description || 'No description available',
          productCount: category.product_count || 0,
          createdAt: new Date(category.created_at).toISOString().split('T')[0],
          status: category.is_active ? 'active' : 'inactive'
        }));

        setCategories(processedCategories);
        setFilteredCategories(processedCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err.response?.data?.error || err.message);
        toast.error('Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    let filtered = categories;

    if (searchTerm) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  const handleAddCategory = () => {
    setFormData({ name: '', description: '' });
    setShowAddModal(true);
  };

  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setFormData({ name: category.name, description: category.description });
    setShowEditModal(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCategories(categories.filter(cat => cat.id !== categoryId));
      toast.success('Category deleted successfully');
    } catch (err) {
      console.error('Error deleting category:', err);
      toast.error(err.response?.data?.error || 'Failed to delete category');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (showEditModal) {
        await axios.put(`/api/categories/${currentCategory.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setCategories(categories.map(cat =>
          cat.id === currentCategory.id
            ? { ...cat, ...formData }
            : cat
        ));
        toast.success('Category updated successfully');
      } else {
        const response = await axios.post('/api/categories', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setCategories([...categories, { ...response.data, id: response.data.id }]);
        toast.success('Category created successfully');
      }

      setShowAddModal(false);
      setShowEditModal(false);
      setFormData({ name: '', description: '' });
      setCurrentCategory(null);
    } catch (err) {
      console.error('Error saving category:', err);
      toast.error(err.response?.data?.error || 'Failed to save category');
    }
  };

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/categories', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const processedCategories = response.data.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description || 'No description available',
        productCount: category.product_count || 0,
        createdAt: new Date(category.created_at).toISOString().split('T')[0],
        status: category.is_active ? 'active' : 'inactive'
      }));

      setCategories(processedCategories);
      setFilteredCategories(processedCategories);
    } catch (err) {
      console.error('Error refreshing categories:', err);
      setError(err.response?.data?.error || err.message);
      toast.error('Failed to refresh categories');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
            <p className="text-gray-600 mt-1">Manage product categories</p>
          </div>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error loading categories: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
          <p className="text-gray-600 mt-1">Manage product categories</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleAddCategory}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <FiPlus className="mr-2" size={16} />
            Add Category
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-600 text-sm font-medium">Total Categories</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{categories.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-600 text-sm font-medium">Active Categories</h3>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {categories.filter(cat => cat.status === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-600 text-sm font-medium">Total Products</h3>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {categories.reduce((sum, cat) => sum + cat.productCount, 0)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            >
              <FiGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            >
              <FiList size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Categories Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  category.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {category.status}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span>{category.productCount} products</span>
                <span>Created {category.createdAt}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button className="text-blue-600 hover:text-blue-700">
                  <FiEye size={16} />
                </button>
                <button
                  onClick={() => handleEditCategory(category)}
                  className="text-green-600 hover:text-green-700"
                >
                  <FiEdit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Category</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Description</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Products</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Created</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{category.name}</div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{category.description}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{category.productCount}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        category.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {category.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{category.createdAt}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-700">
                          <FiEye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {showEditModal ? 'Edit Category' : 'Add New Category'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter category name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter category description"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setFormData({ name: '', description: '' });
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {showEditModal ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;

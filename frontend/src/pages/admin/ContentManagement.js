import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiFilter, FiPlus, FiEdit, FiTrash2, FiEye, FiFileText, FiImage, FiGrid, FiList } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ContentManagement = () => {
  const [banners, setBanners] = useState([]);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('banners');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [showPageModal, setShowPageModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    link: '',
    position: 'hero',
    sortOrder: 0,
    isActive: true
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const [bannersResponse, pagesResponse] = await Promise.all([
          axios.get('/api/admin/banners', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('/api/admin/pages', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const processedBanners = bannersResponse.data.map(banner => ({
          id: banner.id,
          title: banner.title,
          subtitle: banner.subtitle || '',
          image: banner.image || '',
          link: banner.link || '',
          position: banner.position || 'hero',
          sortOrder: banner.sort_order || 0,
          isActive: banner.is_active ? 'active' : 'inactive',
          createdAt: new Date(banner.created_at).toISOString().split('T')[0]
        }));

        const processedPages = pagesResponse.data.map(page => ({
          id: page.id,
          title: page.title,
          slug: page.slug || '',
          content: page.content || '',
          isPublished: page.is_published ? 'published' : 'draft',
          createdAt: new Date(page.created_at).toISOString().split('T')[0],
          updatedAt: new Date(page.updated_at).toISOString().split('T')[0]
        }));

        setBanners(processedBanners);
        setPages(processedPages);
      } catch (err) {
        console.error('Error fetching content:', err);
        setError(err.response?.data?.error || err.message);
        toast.error('Failed to fetch content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleAddBanner = () => {
    setFormData({
      title: '',
      subtitle: '',
      image: '',
      link: '',
      position: 'hero',
      sortOrder: 0,
      isActive: true
    });
    setShowBannerModal(true);
  };

  const handleEditBanner = (banner) => {
    setCurrentItem(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image,
      link: banner.link,
      position: banner.position,
      sortOrder: banner.sortOrder,
      isActive: banner.isActive === 'active'
    });
    setShowBannerModal(true);
  };

  const handleAddPage = () => {
    setFormData({
      title: '',
      content: '',
      isPublished: false
    });
    setShowPageModal(true);
  };

  const handleEditPage = (page) => {
    setCurrentItem(page);
    setFormData({
      title: page.title,
      content: page.content,
      isPublished: page.isPublished === 'published'
    });
    setShowPageModal(true);
  };

  const handleDeleteBanner = async (bannerId) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/banners/${bannerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setBanners(banners.filter(b => b.id !== bannerId));
      toast.success('Banner deleted successfully');
    } catch (err) {
      console.error('Error deleting banner:', err);
      toast.error(err.response?.data?.error || 'Failed to delete banner');
    }
  };

  const handleDeletePage = async (pageId) => {
    if (!window.confirm('Are you sure you want to delete this page?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/pages/${pageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPages(pages.filter(p => p.id !== pageId));
      toast.success('Page deleted successfully');
    } catch (err) {
      console.error('Error deleting page:', err);
      toast.error(err.response?.data?.error || 'Failed to delete page');
    }
  };

  const handleSubmitBanner = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Banner title is required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (currentItem) {
        await axios.put(`/api/admin/banners/${currentItem.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setBanners(banners.map(b =>
          b.id === currentItem.id
            ? { ...b, ...formData, isActive: formData.isActive ? 'active' : 'inactive' }
            : b
        ));
        toast.success('Banner updated successfully');
      } else {
        const response = await axios.post('/api/admin/banners', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setBanners([...banners, { ...response.data, id: response.data.id }]);
        toast.success('Banner created successfully');
      }

      setShowBannerModal(false);
      setFormData({ title: '', subtitle: '', image: '', link: '', position: 'hero', sortOrder: 0, isActive: true });
      setCurrentItem(null);
    } catch (err) {
      console.error('Error saving banner:', err);
      toast.error(err.response?.data?.error || 'Failed to save banner');
    }
  };

  const handleSubmitPage = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Page title is required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (currentItem) {
        await axios.put(`/api/admin/pages/${currentItem.id}`, {
          title: formData.title,
          content: formData.content,
          is_published: formData.isPublished
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setPages(pages.map(p =>
          p.id === currentItem.id
            ? { ...p, ...formData, isPublished: formData.isPublished ? 'published' : 'draft' }
            : p
        ));
        toast.success('Page updated successfully');
      } else {
        const response = await axios.post('/api/admin/pages', {
          title: formData.title,
          content: formData.content,
          is_published: formData.isPublished
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setPages([...pages, { ...response.data, id: response.data.id }]);
        toast.success('Page created successfully');
      }

      setShowPageModal(false);
      setFormData({ title: '', content: '', isPublished: false });
      setCurrentItem(null);
    } catch (err) {
      console.error('Error saving page:', err);
      toast.error(err.response?.data?.error || 'Failed to save page');
    }
  };

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const [bannersResponse, pagesResponse] = await Promise.all([
        axios.get('/api/admin/banners', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/admin/pages', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const processedBanners = bannersResponse.data.map(banner => ({
        id: banner.id,
        title: banner.title,
        subtitle: banner.subtitle || '',
        image: banner.image || '',
        link: banner.link || '',
        position: banner.position || 'hero',
        sortOrder: banner.sort_order || 0,
        isActive: banner.is_active ? 'active' : 'inactive',
        createdAt: new Date(banner.created_at).toISOString().split('T')[0]
      }));

      const processedPages = pagesResponse.data.map(page => ({
        id: page.id,
        title: page.title,
        slug: page.slug || '',
        content: page.content || '',
        isPublished: page.is_published ? 'published' : 'draft',
        createdAt: new Date(page.created_at).toISOString().split('T')[0],
        updatedAt: new Date(page.updated_at).toISOString().split('T')[0]
      }));

      setBanners(processedBanners);
      setPages(processedPages);
    } catch (err) {
      console.error('Error refreshing content:', err);
      setError(err.response?.data?.error || err.message);
      toast.error('Failed to refresh content');
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
            <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
            <p className="text-gray-600 mt-1">Manage website banners and pages</p>
          </div>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error loading content: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600 mt-1">Manage website banners and pages</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex space-x-8 border-b">
          <button
            onClick={() => setActiveTab('banners')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'banners'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Banners ({banners.length})
          </button>
          <button
            onClick={() => setActiveTab('pages')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'pages'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Pages ({pages.length})
          </button>
        </div>
      </div>

      {/* Banners Tab */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Homepage Banners</h2>
            <button
              onClick={handleAddBanner}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <FiPlus className="mr-2" size={16} />
              Add Banner
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((banner) => (
              <div key={banner.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-200 relative">
                  {banner.image ? (
                    <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiImage className="text-gray-400" size={48} />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      banner.isActive === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {banner.isActive}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{banner.title}</h3>
                  {banner.subtitle && (
                    <p className="text-sm text-gray-600 mb-2">{banner.subtitle}</p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span>Position: {banner.position}</span>
                    <span>Order: {banner.sortOrder}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-700">
                      <FiEye size={16} />
                    </button>
                    <button
                      onClick={() => handleEditBanner(banner)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteBanner(banner.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pages Tab */}
      {activeTab === 'pages' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Static Pages</h2>
            <button
              onClick={handleAddPage}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <FiPlus className="mr-2" size={16} />
              Add Page
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Page Title</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Created</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Updated</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pages.map((page) => (
                    <tr key={page.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">{page.title}</div>
                        {page.slug && (
                          <div className="text-sm text-gray-600">/{page.slug}</div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          page.isPublished === 'published' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {page.isPublished}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">{page.createdAt}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">{page.updatedAt}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-700">
                            <FiEye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditPage(page)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeletePage(page.id)}
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
        </div>
      )}

      {/* Banner Modal */}
      {showBannerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {currentItem ? 'Edit Banner' : 'Add New Banner'}
            </h3>
            <form onSubmit={handleSubmitBanner}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Banner Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter banner title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter banner subtitle"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter image URL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link URL
                  </label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter link URL"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position
                    </label>
                    <select
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="hero">Hero</option>
                      <option value="sidebar">Sidebar</option>
                      <option value="footer">Footer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowBannerModal(false);
                    setFormData({ title: '', subtitle: '', image: '', link: '', position: 'hero', sortOrder: 0, isActive: true });
                    setCurrentItem(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {currentItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Page Modal */}
      {showPageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {currentItem ? 'Edit Page' : 'Add New Page'}
            </h3>
            <form onSubmit={handleSubmitPage}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter page title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter page content"
                    rows={10}
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Published</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowPageModal(false);
                    setFormData({ title: '', content: '', isPublished: false });
                    setCurrentItem(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {currentItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;

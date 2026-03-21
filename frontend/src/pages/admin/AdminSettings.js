import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSettings, FiDatabase, FiShield, FiUsers, FiServer, FiActivity, FiClock, FiHardDrive, FiWifi, FiLock, FiUnlock, FiRefreshCw, FiAlertTriangle, FiCheckCircle, FiXCircle, FiGlobe, FiMail, FiKey, FiMonitor, FiCpu, FiZap } from 'react-icons/fi';
import { toast } from 'react-toastify';

const AdminSettings = () => {
  const [systemInfo, setSystemInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    siteName: 'MyShop E-commerce',
    siteEmail: 'admin@myshop.com',
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    enableTwoFactor: false,
    backupFrequency: 'daily',
    logRetention: '30days'
  });

  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/admin/system/info', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSystemInfo(response.data);
      } catch (err) {
        console.error('Error fetching system info:', err);
        toast.error('Failed to load system information');
      } finally {
        setLoading(false);
      }
    };

    fetchSystemInfo();
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/system/settings', settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Settings saved successfully');
    } catch (err) {
      console.error('Error saving settings:', err);
      toast.error('Failed to save settings');
    }
  };

  const clearCache = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/system/clear-cache', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('System cache cleared successfully');
    } catch (err) {
      console.error('Error clearing cache:', err);
      toast.error('Failed to clear system cache');
    }
  };

  const backupDatabase = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/admin/system/backup', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Create download link for backup
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `system_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Database backup downloaded successfully');
    } catch (err) {
      console.error('Error backing up database:', err);
      toast.error('Failed to backup database');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-1">Manage platform configuration and system administration</p>
        </div>
        <button
          onClick={saveSettings}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save All Settings
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex space-x-1 mb-6">
          {['general', 'security', 'database', 'performance', 'email', 'backup'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleSettingChange('siteName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Email</label>
                <input
                  type="email"
                  value={settings.siteEmail}
                  onChange={(e) => handleSettingChange('siteEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Mode</label>
                <select
                  value={settings.maintenanceMode}
                  onChange={(e) => handleSettingChange('maintenanceMode', e.target.value === 'true')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="false">Disabled</option>
                  <option value="true">Enabled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Allow Registration</label>
                <select
                  value={settings.allowRegistration}
                  onChange={(e) => handleSettingChange('allowRegistration', e.target.value === 'true')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Require Email Verification</label>
                <select
                  value={settings.requireEmailVerification}
                  onChange={(e) => handleSettingChange('requireEmailVerification', e.target.value === 'true')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="true">Required</option>
                  <option value="false">Optional</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="5"
                  max="120"
                />
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                <input
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="3"
                  max="10"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password Min Length</label>
                <input
                  type="number"
                  value={settings.passwordMinLength}
                  onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="6"
                  max="20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enable Two-Factor Auth</label>
                <select
                  value={settings.enableTwoFactor}
                  onChange={(e) => handleSettingChange('enableTwoFactor', e.target.value === 'true')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">IP Whitelist</label>
                <textarea
                  value={settings.ipWhitelist || ''}
                  onChange={(e) => handleSettingChange('ipWhitelist', e.target.value)}
                  placeholder="Enter IP addresses (one per line)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">Security Recommendations</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Enable SSL certificate for secure connections</li>
                <li>• Regularly update admin passwords</li>
                <li>• Monitor failed login attempts</li>
                <li>• Use strong, unique passwords</li>
              </ul>
            </div>
          </div>
        )}

        {/* Database Settings */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                <select
                  value={settings.backupFrequency}
                  onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Log Retention</label>
                <select
                  value={settings.logRetention}
                  onChange={(e) => handleSettingChange('logRetention', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="7days">7 Days</option>
                  <option value="30days">30 Days</option>
                  <option value="90days">90 Days</option>
                  <option value="1year">1 Year</option>
                </select>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Database Information</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <div>• Database: MySQL 8.0</div>
                <div>• Size: ~45.2 MB</div>
                <div>• Tables: 15</div>
                <div>• Last Backup: 2 days ago</div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Settings */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cache TTL (seconds)</label>
                <input
                  type="number"
                  value={settings.cacheTTL || 3600}
                  onChange={(e) => handleSettingChange('cacheTTL', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="60"
                  max="86400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Upload Size (MB)</label>
                <input
                  type="number"
                  value={settings.maxUploadSize || 10}
                  onChange={(e) => handleSettingChange('maxUploadSize', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="100"
                />
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-green-800 mb-2">Performance Metrics</h4>
              <div className="text-sm text-green-700 space-y-1">
                <div>• CPU Usage: 23%</div>
                <div>• Memory Usage: 67%</div>
                <div>• Disk Space: 45.2 GB / 100 GB</div>
                <div>• Uptime: 99.8%</div>
              </div>
            </div>
          </div>
        )}

        {/* Email Settings */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Server</label>
                <input
                  type="text"
                  value={settings.smtpServer || ''}
                  onChange={(e) => handleSettingChange('smtpServer', e.target.value)}
                  placeholder="smtp.gmail.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                <input
                  type="number"
                  value={settings.smtpPort || 587}
                  onChange={(e) => handleSettingChange('smtpPort', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="65535"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Username</label>
                <input
                  type="text"
                  value={settings.smtpUsername || ''}
                  onChange={(e) => handleSettingChange('smtpUsername', e.target.value)}
                  placeholder="your-email@gmail.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Password</label>
                <input
                  type="password"
                  value={settings.smtpPassword || ''}
                  onChange={(e) => handleSettingChange('smtpPassword', e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <button
                onClick={() => toast.info('Test email functionality coming soon')}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
              >
                <FiMail className="mr-2" size={16} />
                Test Email Configuration
              </button>
            </div>
          </div>
        )}

        {/* Backup Settings */}
        {activeTab === 'backup' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Backup & Recovery</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Auto Backup</label>
                <select
                  value={settings.autoBackup || 'daily'}
                  onChange={(e) => handleSettingChange('autoBackup', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="disabled">Disabled</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Backup Retention</label>
                <select
                  value={settings.backupRetention || '30days'}
                  onChange={(e) => handleSettingChange('backupRetention', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="7days">7 Days</option>
                  <option value="30days">30 Days</option>
                  <option value="90days">90 Days</option>
                  <option value="1year">1 Year</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={backupDatabase}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <FiDatabase className="mr-2" size={16} />
                Download Full Backup
              </button>
              
              <button
                onClick={clearCache}
                className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center"
              >
                <FiRefreshCw className="mr-2" size={16} />
                Clear System Cache
              </button>
              
              <button
                onClick={() => toast.info('Restore functionality coming soon')}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <FiHardDrive className="mr-2" size={16} />
                Restore from Backup
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={clearCache}
            className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
          >
            <FiZap className="text-blue-600 mb-2" size={24} />
            <span className="font-medium text-blue-600">Clear Cache</span>
          </button>
          <button
            onClick={backupDatabase}
            className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left"
          >
            <FiDatabase className="text-green-600 mb-2" size={24} />
            <span className="font-medium text-green-600">Backup Now</span>
          </button>
          <button
            onClick={() => toast.info('System restart functionality coming soon')}
            className="p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors text-left"
          >
            <FiRefreshCw className="text-orange-600 mb-2" size={24} />
            <span className="font-medium text-orange-600">Restart System</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;

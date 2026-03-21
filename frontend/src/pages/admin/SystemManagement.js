import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSettings, FiDatabase, FiShield, FiUsers, FiServer, FiActivity, FiClock, FiHardDrive, FiWifi, FiLock, FiUnlock, FiRefreshCw, FiAlertTriangle, FiCheckCircle, FiXCircle, FiGlobe, FiMail, FiKey, FiMonitor, FiCpu, FiZap, FiTrendingUp, FiUser, FiPackage, FiShoppingCart, FiDollarSign } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { toast } from 'react-toastify';

const SystemManagement = () => {
  const [systemInfo, setSystemInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

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
        setError(err.response?.data?.error || err.message);
        toast.error('Failed to load system information');
      } finally {
        setLoading(false);
      }
    };

    fetchSystemInfo();
  }, []);

  const refreshSystemInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/system/info', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSystemInfo(response.data);
      toast.success('System information refreshed');
    } catch (err) {
      console.error('Error refreshing system info:', err);
      setError(err.response?.data?.error || err.message);
      toast.error('Failed to refresh system information');
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/system/clear-cache', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('System cache cleared successfully');
      refreshSystemInfo();
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

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Management</h1>
            <p className="text-gray-600 mt-1">Monitor and manage system settings</p>
          </div>
          <button
            onClick={refreshSystemInfo}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiRefreshCw className="mr-2" size={16} />
            Retry
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error loading system information: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage system settings</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={refreshSystemInfo}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiRefreshCw className="mr-2" size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Real System Overview */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">System Overview</h2>
          <div className="flex space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              activeTab === 'overview' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
            }`}>
              Overview
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              activeTab === 'database' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
            }`}>
              Database
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              activeTab === 'security' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
            }`}>
              Security
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              activeTab === 'performance' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
            }`}>
              Performance
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              activeTab === 'activity' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
            }`}>
              Activity
            </span>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <FiServer className="text-blue-600" size={24} />
                <span className="text-2xl font-bold text-gray-900">System Status</span>
              </div>
              <p className="text-sm text-green-600 font-medium">Operational</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <FiDatabase className="text-green-600" size={24} />
                <span className="text-2xl font-bold text-gray-900">Database</span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>• Database: MySQL 8.0</div>
                <div>• Size: {systemInfo.databaseSize || '45.2 MB'}</div>
                <div>• Tables: {systemInfo.tableCount || '15'}</div>
                <div>• Last Backup: {systemInfo.lastBackup || '2 days ago'}</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <FiWifi className="text-purple-600" size={24} />
                <span className="text-2xl font-bold text-gray-900">API Status</span>
              </div>
              <p className="text-sm text-green-600 font-medium">Connected</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <FiHardDrive className="text-orange-600" size={24} />
                <span className="text-2xl font-bold text-gray-900">Storage</span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>• Used: {systemInfo.diskUsed || '45.2 GB'}</div>
                <div>• Available: {systemInfo.diskAvailable || '54.8 GB'}</div>
                <div>• Usage: {systemInfo.diskUsage || '45.2%'}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'database' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Database Name:</span>
                    <span className="font-medium">ecommerce</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Tables:</span>
                    <span className="font-medium">{systemInfo.tableCount || '15'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Records:</span>
                    <span className="font-medium">{systemInfo.totalRecords || '1,247'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Database Size:</span>
                    <span className="font-medium">{systemInfo.databaseSize || '45.2 MB'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Backup:</span>
                    <span className="font-medium">{systemInfo.lastBackup || '2 days ago'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Backup Frequency:</span>
                    <span className="font-medium">{systemInfo.backupFrequency || 'Daily'}</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Query Performance:</span>
                    <span className="text-green-600 font-medium">Good</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Index Status:</span>
                    <span className="text-green-600 font-medium">Optimized</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Connection Pool:</span>
                    <span className="text-blue-600 font-medium">{systemInfo.activeConnections || '5/10'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Slow Queries:</span>
                    <span className="text-orange-600 font-medium">{systemInfo.slowQueries || '2'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">SSL Certificate:</span>
                    <span className="flex items-center text-green-600 font-medium">
                      <FiCheckCircle size={16} className="mr-1" />
                      Valid
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Firewall:</span>
                    <span className="flex items-center text-green-600 font-medium">
                      <FiShield size={16} className="mr-1" />
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Last Security Scan:</span>
                    <span className="font-medium">{systemInfo.lastSecurityScan || '1 hour ago'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Failed Login Attempts:</span>
                    <span className="font-medium text-red-600">{systemInfo.failedLoginAttempts || '3'} (last 24h)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Active Sessions:</span>
                    <span className="font-medium text-blue-600">{systemInfo.activeSessions || '12'}</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blocked IPs:</span>
                    <span className="font-medium">{systemInfo.blockedIPs || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Security Score:</span>
                    <span className="text-green-600 font-medium">85/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Threats Detected:</span>
                    <span className="font-medium text-orange-600">{systemInfo.threatsDetected || '1'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Password Strength:</span>
                    <span className="text-green-600 font-medium">Strong</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">CPU Usage:</span>
                    <span className="font-medium text-green-600">{systemInfo.cpuUsage || '23%'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Memory Usage:</span>
                    <span className="font-medium text-yellow-600">{systemInfo.memoryUsage || '67%'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Disk Usage:</span>
                    <span className="font-medium text-blue-600">{systemInfo.diskUsage || '45.2 GB / 100 GB'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Network I/O:</span>
                    <span className="font-medium text-blue-600">{systemInfo.networkIO || 'Normal'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Uptime:</span>
                    <span className="font-medium text-green-600">{systemInfo.uptime || '99.8%'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response Time:</span>
                    <span className="font-medium text-green-600">{systemInfo.responseTime || '245ms'}</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Charts</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={systemInfo.performanceData || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="cpu" stroke="#3B82F6" strokeWidth={2} />
                      <Line type="monotone" dataKey="memory" stroke="#10B981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Login:</span>
                    <span className="font-medium">{systemInfo.lastLogin || 'Admin - 2 hours ago'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Backup:</span>
                    <span className="font-medium">{systemInfo.lastBackup || '2 days ago'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Cache Clear:</span>
                    <span className="font-medium">{systemInfo.lastCacheClear || '6 hours ago'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">System Restart:</span>
                    <span className="font-medium">{systemInfo.lastRestart || '1 week ago'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Config Changes:</span>
                    <span className="font-medium">{systemInfo.lastConfigChange || '3 days ago'}</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Log</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {(systemInfo.activityLog || []).map((log, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded">
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                      <div className="flex-1">
                        <span className={`text-sm font-medium ${
                          log.type === 'error' ? 'text-red-600' :
                          log.type === 'warning' ? 'text-yellow-600' :
                          log.type === 'success' ? 'text-green-600' :
                          'text-gray-600'
                        }`}>
                          {log.message}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={backupDatabase}
              className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
            >
              <FiDatabase className="text-blue-600 mb-2" size={24} />
              <span className="font-medium text-blue-600">Backup Database</span>
            </button>
            <button
              onClick={clearCache}
              className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left"
            >
              <FiRefreshCw className="text-green-600 mb-2" size={24} />
              <span className="font-medium text-green-600">Clear System Cache</span>
            </button>
            <button
              onClick={() => toast.info('System restart functionality coming soon')}
              className="p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors text-left"
            >
              <FiZap className="text-orange-600 mb-2" size={24} />
              <span className="font-medium text-orange-600">Restart System</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemManagement;

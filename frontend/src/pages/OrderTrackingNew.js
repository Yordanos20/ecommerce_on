import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("🚀 OrderTracking component mounted");
  console.log("🔑 Order ID from URL:", id);
  console.log("🔑 Token available:", !!token);

  useEffect(() => {
    if (!token) {
      console.log("❌ No token found - redirecting to login");
      toast.error('Please login to track your order');
      navigate('/login');
      return;
    }

    console.log("🛒 Starting fetchOrderDetails...");
    fetchOrderDetails();
  }, [id, token, navigate]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      console.log("📡 Attempting to fetch real order from backend...");
      console.log("🌐 Backend URL: http://localhost:5001/api/orders/${id}");
      
      // Try to fetch real order from backend
      const response = await fetch(`http://localhost:5001/api/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("📊 Backend response status:", response.status);
      console.log("📊 Backend response ok:", response.ok);

      if (response.ok) {
        const orderData = await response.json();
        console.log("✅ Real order data received:", orderData);
        setOrder(orderData);
        console.log("✅ Real order loaded successfully");
      } else {
        console.log("🔄 Backend failed, checking mockOrders array...");
        
        // Check if it's a mock order in mockOrders array
        const mockOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
        const mockOrder = mockOrders.find(order => order.id === id);
        
        if (mockOrder) {
          console.log("✅ Found mock order in mockOrders array:", mockOrder);
          setOrder(mockOrder);
          console.log("✅ Mock order loaded successfully");
        } else {
          console.log("❌ Order not found anywhere - neither backend nor mock orders");
          toast.error('Order not found');
          navigate('/customer/orders');
        }
      }
    } catch (error) {
      console.error('❌ Error fetching order:', error);
      toast.error('Order not found');
      navigate('/customer/orders');
    } finally {
      setLoading(false);
      console.log("🏁 fetchOrderDetails completed");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'pending_payment': 'bg-orange-100 text-orange-800 border-orange-200',
      'confirmed': 'bg-blue-100 text-blue-800 border-blue-200',
      'processing': 'bg-purple-100 text-purple-800 border-purple-200',
      'shipped': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'delivered': 'bg-green-100 text-green-800 border-green-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'pending': '⏳',
      'pending_payment': '💳',
      'confirmed': '✅',
      'processing': '🔄',
      'shipped': '📦',
      'delivered': '🎉',
      'cancelled': '❌'
    };
    return icons[status] || '📋';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Pending';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-blue-800">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 4l-2 2m0 4v10a3 3 0 00-3-3h14a3 3 0 00-3-3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
            <button
              onClick={() => navigate('/customer/orders')}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Back to My Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/customer/orders')}
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to My Orders
            </button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">Order Tracking</h1>
              <p className="text-gray-600">Track your order #{id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Status Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="text-center mb-6">
                <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-bold ${getStatusColor(order.status)}`}>
                  <span className="text-2xl mr-3">{getStatusIcon(order.status)}</span>
                  <span>{order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {order.status === 'delivered' ? 'Order Delivered Successfully!' : 'Order in Progress'}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-semibold">#{order.id || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold text-2xl text-blue-600">${order.total_amount || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-medium">{formatDate(order.created_at)}</span>
                </div>
              </div>

              {order.mockOrder && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 12 0v3a1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 012 0z" clipRule="evenodd" />
                    </svg>
                    <p className="text-yellow-800 text-sm">
                      <strong>Demo Order:</strong> This is a demonstration order for testing purposes.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Details</h2>
              
              <div className="space-y-6">
                {/* Shipping Address */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">📦 Shipping Address</h3>
                  {order.shipping_address ? (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">{order.shipping_address.email?.split('@')[0] || 'Customer'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Address:</span>
                          <span className="font-medium">{order.shipping_address.address}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">City:</span>
                          <span className="font-medium">{order.shipping_address.city}, {order.shipping_address.state}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium">{order.shipping_address.phone}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800">
                        <strong>Shipping Information Not Available</strong>
                      </p>
                    </div>
                  )}
                </div>

                {/* Order Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">📋 Order Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium">#{order.id || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="font-medium">{formatDate(order.created_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium">{order.payment_method || 'Chapa'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className="font-medium">{order.payment_verified ? 'Verified' : 'Pending'}</span>
                    </div>
                    {order.payment_reference && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction Ref:</span>
                        <span className="font-medium text-sm">{order.payment_reference}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">📦 Order Items</h3>
                {order.items && order.items.length > 0 ? (
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v1h16a2 2 0 00-2 2H4z" />
                              <path fillRule="evenodd" d="M18 9H2v1h16V6a2 2 0 00-2 2H4z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {item.name || `Product ${item.product_id || item.id}`}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity || 1}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-blue-600">
                            ${item.price || '0.00'}
                          </p>
                          <p className="text-sm text-gray-600">
                            Total: ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">
                      <strong>No Items Found</strong>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

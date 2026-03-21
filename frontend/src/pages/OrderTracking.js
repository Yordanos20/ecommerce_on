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
  const [trackingSteps, setTrackingSteps] = useState([]);

  console.log("🚀 OrderTracking component mounted");
  console.log("🔑 Order ID from URL:", id);
  console.log("🔑 Token available:", !!token);
  console.log("👤 User:", user);

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
      console.log("🌐 Backend URL: https://ecommerce-backend-ol0h.onrender.com/api/orders/${id}");
      
      // Try to fetch real order from backend
      const response = await fetch(`https://ecommerce-backend-ol0h.onrender.com/api/orders/${id}`, {
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
        generateTrackingSteps(orderData);
        console.log("✅ Real order loaded successfully");
      } else {
        console.log("🔄 Backend failed, checking mockOrders array as LAST RESORT...");
        
        // Check if it's a mock order in mockOrders array (LAST RESORT ONLY)
        const mockOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
        const mockOrder = mockOrders.find(order => order.id === id);
        
        if (mockOrder) {
          console.log("⚠️ Using MOCK ORDER from localStorage (backend unavailable):", mockOrder);
          setOrder(mockOrder);
          generateTrackingSteps(mockOrder);
        } else {
          console.log("❌ Order not found anywhere - neither backend nor mock orders");
          toast.error('Order not found in system');
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

  const generateTrackingSteps = (orderData) => {
    const steps = [
      {
        id: 1,
        title: 'Order Placed',
        description: 'Your order has been successfully placed',
        time: orderData.created_at,
        completed: true,
        icon: '📋'
      },
      {
        id: 2,
        title: 'Order Confirmed',
        description: 'Your order has been confirmed and is being processed',
        time: new Date(new Date(orderData.created_at).getTime() + 30 * 60000).toISOString(),
        completed: orderData.status !== 'pending',
        icon: '✅'
      },
      {
        id: 3,
        title: 'Processing',
        description: 'Your order is being prepared for shipment',
        time: new Date(new Date(orderData.created_at).getTime() + 2 * 3600000).toISOString(),
        completed: ['processing', 'shipped', 'delivered'].includes(orderData.status),
        icon: '🔄'
      },
      {
        id: 4,
        title: 'Shipped',
        description: 'Your order has been shipped and is on its way',
        time: new Date(new Date(orderData.created_at).getTime() + 24 * 3600000).toISOString(),
        completed: ['shipped', 'delivered'].includes(orderData.status),
        icon: '📦'
      },
      {
        id: 5,
        title: 'Out for Delivery',
        description: 'Your order is out for delivery',
        time: new Date(new Date(orderData.created_at).getTime() + 48 * 3600000).toISOString(),
        completed: orderData.status === 'delivered',
        icon: '🚚'
      },
      {
        id: 6,
        title: 'Delivered',
        description: 'Your order has been successfully delivered',
        time: new Date(new Date(orderData.created_at).getTime() + 72 * 3600000).toISOString(),
        completed: orderData.status === 'delivered',
        icon: '🎉'
      }
    ];

    setTrackingSteps(steps);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Pending';
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'processing': 'bg-purple-100 text-purple-800',
      'shipped': 'bg-indigo-100 text-indigo-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Order Not Found</h2>
          <button
            onClick={() => navigate('/customer/orders')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View My Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      {/* Debug Panel */}
      <div className="max-w-4xl mx-auto px-4 mb-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">🔍 Debug Information</h3>
          <div className="text-sm text-yellow-700 space-y-1">
            <p><strong>Order ID:</strong> {order?.id || 'Not loaded'}</p>
            <p><strong>Data Source:</strong> {order?.mockOrder ? 'Mock Data' : 'Backend Data'}</p>
            <p><strong>Order Status:</strong> {order?.status || 'Unknown'}</p>
            <p><strong>Items Count:</strong> {order?.items?.length || 0}</p>
            <p><strong>Total Amount:</strong> ${order?.total_amount || '0.00'}</p>
            {order?.payment_reference && (
              <p><strong>Payment Ref:</strong> {order.payment_reference}</p>
            )}
          </div>
          
          {order?.mockOrder && (
            <div className="mt-4 pt-4 border-t border-yellow-300">
              <button
                onClick={() => {
                  localStorage.removeItem('mockOrders');
                  localStorage.removeItem('mockOrder');
                  localStorage.removeItem('mockPaymentResult');
                  toast.success('Mock data cleared! Refresh to see real data.');
                  navigate('/customer/orders');
                }}
                className="w-full bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors text-sm"
              >
                🗑️ Clear Mock Data
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/customer/orders')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Orders
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Order Tracking
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your order #{order.id} status and delivery progress
          </p>
        </div>

        {/* Order Status Badge */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Order Status
              </h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Order Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${order.total_amount || '0.00'}
              </p>
            </div>
          </div>

          {order.mockOrder && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-yellow-800 text-sm">
                  <strong>Mock Order:</strong> This is a demonstration order for testing purposes.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tracking Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Delivery Timeline
          </h2>
          
          <div className="relative">
            {trackingSteps.map((step, index) => (
              <div key={step.id} className="flex items-start mb-8 last:mb-0">
                {/* Timeline Line */}
                {index < trackingSteps.length - 1 && (
                  <div className={`absolute left-6 top-12 w-0.5 h-full ${
                    step.completed ? 'bg-green-500' : 'bg-gray-300'
                  }`} style={{ left: '24px' }}></div>
                )}
                
                {/* Step Circle */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                  step.completed 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  <span className="text-lg">{step.icon}</span>
                </div>
                
                {/* Step Content */}
                <div className="ml-6 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold ${
                      step.completed 
                        ? 'text-gray-900 dark:text-white' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {step.title}
                    </h3>
                    {step.completed && (
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className={`text-sm ${
                    step.completed 
                      ? 'text-gray-600 dark:text-gray-300' 
                      : 'text-gray-400 dark:text-gray-500'
                  } mb-1`}>
                    {step.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(step.time)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Order Details
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Shipping Address */}
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Shipping Address</h3>
              {order.shipping_address ? (
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <p>{order.shipping_address.address}</p>
                  <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}</p>
                  <p>{order.shipping_address.country}</p>
                  <p>{order.shipping_address.phone}</p>
                  <p>{order.shipping_address.email}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">Address not available</p>
              )}
            </div>

            {/* Order Info */}
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Order Information</h3>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p><strong>Order ID:</strong> #{order.id}</p>
                <p><strong>Order Date:</strong> {formatDate(order.created_at)}</p>
                <p><strong>Payment Method:</strong> {order.payment_method || 'Chapa'}</p>
                <p><strong>Payment Status:</strong> {order.payment_verified ? 'Verified' : 'Pending'}</p>
                {order.payment_reference && (
                  <p><strong>Transaction Ref:</strong> {order.payment_reference}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Order Items
          </h2>
          
          <div className="space-y-4">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {item.name || `Product ${item.product_id || item.id}`}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Quantity: {item.quantity || 1}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ${item.price || '0.00'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Total: ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No items found in this order
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

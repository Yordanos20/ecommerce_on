import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function MockPayment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const orderId = searchParams.get('order_id');
  const txRef = searchParams.get('tx_ref');
  const amount = searchParams.get('amount');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!orderId || !txRef || !amount) {
      toast.error('Invalid payment parameters');
      navigate('/checkout');
    }
  }, [orderId, txRef, amount, navigate]);

  const handlePayment = async (paymentType) => {
    setLoading(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create payment success response
    const paymentData = {
      status: 'success',
      tx_ref: txRef,
      order_id: orderId,
      amount: amount,
      payment_method: paymentType,
      paid_at: new Date().toISOString()
    };

    // Store payment result
    localStorage.setItem('mockPaymentResult', JSON.stringify(paymentData));

    // Clear cart
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify([]));
    }

    // Redirect to payment verification
    const verifyUrl = `/payment/verify?payment=success&tx_ref=${txRef}&order_id=${orderId}`;
    window.location.href = verifyUrl;
  };

  const handleCancel = () => {
    toast.info('Payment cancelled');
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Chapa Payment</h1>
          <p className="text-gray-600">Complete your payment securely</p>
        </div>

        {/* Payment Card */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          {/* Order Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Order Summary</h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Order ID:</span>
                <span className="text-sm font-medium">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Transaction Ref:</span>
                <span className="text-sm font-medium">{txRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Email:</span>
                <span className="text-sm font-medium">{email}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-base font-semibold">Amount:</span>
                <span className="text-base font-bold text-blue-600">${amount}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select Payment Method</h3>
            <div className="space-y-3">
              {/* Card Payment */}
              <button
                onClick={() => handlePayment('card')}
                disabled={loading}
                className="w-full p-4 border-2 border-blue-500 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Credit/Debit Card</p>
                      <p className="text-sm text-gray-500">Visa, Mastercard, Amex</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>

              {/* Mobile Money */}
              <button
                onClick={() => handlePayment('mobile')}
                disabled={loading}
                className="w-full p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Mobile Money</p>
                      <p className="text-sm text-gray-500">M-Pesa, TeleBirr, etc.</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>

              {/* Bank Transfer */}
              <button
                onClick={() => handlePayment('bank')}
                disabled={loading}
                className="w-full p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Bank Transfer</p>
                      <p className="text-sm text-gray-500">Direct bank payment</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          {/* Test Mode Notice */}
          <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-yellow-800 text-sm">
                <strong>Test Mode:</strong> This is a demo payment. No actual charges will be made.
              </p>
            </div>
          </div>

          {/* Cancel Button */}
          <button
            onClick={handleCancel}
            disabled={loading}
            className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel Payment
          </button>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Processing payment...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

export default function PaymentVerify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  
  const tx_ref = searchParams.get("tx_ref");
  const status = searchParams.get("payment");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!tx_ref) {
        toast.error("Invalid payment reference");
        navigate("/cart");
        return;
      }

      try {
        console.log("🔍 Verifying payment:", { tx_ref, status });
        
        // Check if this is a mock payment
        const mockPaymentResult = localStorage.getItem('mockPaymentResult');
        if (mockPaymentResult) {
          const paymentData = JSON.parse(mockPaymentResult);
          
          if (paymentData.tx_ref === tx_ref && paymentData.status === 'success') {
            console.log("✅ Mock payment verified successfully");
            
            // Update order status in mockOrders array
            const mockOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
            const updatedOrders = mockOrders.map(order => {
              if (order.id === paymentData.order_id) {
                return {
                  ...order,
                  status: 'processing',
                  payment_verified: true,
                  paid_at: new Date().toISOString()
                };
              }
              return order;
            });
            localStorage.setItem('mockOrders', JSON.stringify(updatedOrders));
            console.log("📋 Updated mock orders array:", updatedOrders);
            
            // Clear mock payment data
            localStorage.removeItem('mockPaymentResult');
            localStorage.removeItem('mockOrder');
            
            // Get order ID from payment data or URL params
            const orderId = paymentData.order_id || searchParams.get("order_id");
            
            toast.success("Payment successful!");
            setTimeout(() => {
              navigate(`/order-confirmation/${orderId}`, {
                state: {
                  mockOrder: true,
                  orderId: orderId,
                  paymentVerified: true
                }
              });
            }, 2000);
            return;
          }
        }
        
        // Try to verify with backend
        const response = await api.post("/chapa-payment/verify", { tx_ref });
        console.log("✅ Payment verification response:", response);

        if (response.data.success) {
          toast.success("Payment successful!");
          setTimeout(() => {
            navigate(`/order-confirmation/${response.data.order_id}`);
          }, 2000);
        } else {
          toast.error("Payment verification failed");
          navigate("/cart");
        }
      } catch (error) {
        console.error("❌ Payment verification error:", error);
        
        // Fallback: if backend is not available, check for mock payment
        const mockPaymentResult = localStorage.getItem('mockPaymentResult');
        if (mockPaymentResult) {
          const paymentData = JSON.parse(mockPaymentResult);
          if (paymentData.tx_ref === tx_ref) {
            console.log("🔄 Using fallback mock payment verification");
            localStorage.removeItem('mockPaymentResult');
            localStorage.removeItem('mockOrder');
            
            const orderId = paymentData.order_id || searchParams.get("order_id");
            toast.success("Payment successful! (Backend offline)");
            setTimeout(() => {
              navigate(`/order-confirmation/${orderId}`, {
                state: {
                  mockOrder: true,
                  orderId: orderId,
                  paymentVerified: true
                }
              });
            }, 2000);
            return;
          }
        }
        
        toast.error("Payment verification failed. Please contact support.");
        navigate("/cart");
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [tx_ref, status, navigate]);

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">Verifying Payment...</h2>
          <p className="text-gray-600 mt-2">Please wait while we confirm your payment</p>
        </div>
      </div>
    );
  }

  return null;
}

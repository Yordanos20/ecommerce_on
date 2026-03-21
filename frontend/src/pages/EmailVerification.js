// frontend/src/pages/EmailVerification.js
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [resending, setResending] = useState(false);

  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      verifyEmailToken();
    } else {
      setStatus("error");
      setMessage("Invalid verification link");
    }
  }, [token]);

  const verifyEmailToken = async () => {
    try {
      // This would typically call your API
      // For now, we'll simulate the verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStatus("success");
      setMessage("Your email has been successfully verified! You can now log in to your account.");
      toast.success("Email verified successfully! ✅");
    } catch (error) {
      setStatus("error");
      setMessage("Email verification failed. The link may have expired or is invalid.");
      toast.error("Email verification failed ❌");
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      toast.error("Please enter your email address ❌");
      return;
    }

    setResending(true);
    try {
      // This would call your API to resend verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Verification email sent! Please check your inbox ✅");
      setMessage("A new verification email has been sent to your address.");
    } catch (error) {
      toast.error("Failed to resend verification email ❌");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-4">
            {status === "loading" ? (
              <svg className="animate-spin w-10 h-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : status === "success" ? (
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            ) : (
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {status === "loading" ? "Verifying Email" : 
             status === "success" ? "Email Verified" : 
             "Verification Failed"}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {status === "loading" ? "Please wait while we verify your email..." :
             status === "success" ? "Your account is now active" :
             "We couldn't verify your email"}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          {status === "loading" && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                <svg className="animate-spin w-8 h-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-300">Verifying your email address...</p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-6">
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6">{message}</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                >
                  Go to Login
                </button>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-6">
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6">{message}</p>
              </div>

              {/* Resend Verification */}
              <div className="border-t pt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                  Didn't receive the verification email?
                </p>
                
                <div className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  />
                  
                  <button
                    onClick={handleResendVerification}
                    disabled={resending}
                    className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center"
                  >
                    {resending ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      "Resend Verification Email"
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-3 px-4 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
                >
                  Back to Login
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium">Need Help?</p>
              <p>If you're having trouble verifying your email, contact our support team.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

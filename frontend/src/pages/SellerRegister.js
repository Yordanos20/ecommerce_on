// frontend/src/pages/SellerRegister.js
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function SellerRegister() {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    storeName: "",
    storeDescription: "",
    businessAddress: "",
    businessType: "individual",
    bankAccount: "",
    bankName: "",
    accountHolder: "",
    routingNumber: "",
    taxId: "",
    businessRegistration: "",
  });
  
  const [storeLogo, setStoreLogo] = useState(null);
  const [storeBanner, setStoreBanner] = useState(null);
  const [idDocument, setIdDocument] = useState(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = calculatePasswordStrength(formData.password);
  const getStrengthColor = (strength) => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength) => {
    if (strength <= 2) return "Weak";
    if (strength <= 4) return "Medium";
    return "Strong";
  };

  // Password validation
  const passwordRequirements = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password),
    match: formData.password === formData.confirmPassword && formData.password !== "",
  };

  const isPasswordStrong = Object.values(passwordRequirements).every(Boolean);

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation
  const isValidPhone = (phone) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.length >= 10;
  };

  // File handlers
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'logo') setStoreLogo(file);
      else if (type === 'banner') setStoreBanner(file);
      else if (type === 'id') setIdDocument(file);
    }
  };

  // Form validation for current step
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.fullName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
          toast.error("Please fill all required fields ❌");
          return false;
        }
        if (!isValidEmail(formData.email)) {
          toast.error("Please enter a valid email address ❌");
          return false;
        }
        if (!isValidPhone(formData.phone)) {
          toast.error("Please enter a valid phone number ❌");
          return false;
        }
        if (!isPasswordStrong) {
          toast.error("Please meet all password requirements ❌");
          return false;
        }
        return true;
      
      case 2:
        if (!formData.storeName || !formData.storeDescription || !formData.businessAddress) {
          toast.error("Please fill all store information fields ❌");
          return false;
        }
        return true;
      
      case 3:
        if (!formData.bankAccount || !formData.bankName || !formData.accountHolder) {
          toast.error("Please fill all required payment details ❌");
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreeToTerms) {
      toast.error("Please agree to the Seller Terms & Conditions ❌");
      return;
    }

    setLoading(true);
    try {
      // Register user as Seller
      const res = await register({ 
        name: formData.fullName,
        email: formData.email, 
        phone: formData.phone,
        password: formData.password,
        storeName: formData.storeName,
        storeDescription: formData.storeDescription,
        businessAddress: formData.businessAddress,
        businessType: formData.businessType,
        bankAccount: formData.bankAccount,
        bankName: formData.bankName,
        accountHolder: formData.accountHolder,
        routingNumber: formData.routingNumber,
        taxId: formData.taxId,
        businessRegistration: formData.businessRegistration,
        role: "Seller"
      });
      
      if (res.success) {
        toast.success("Seller registration successful! Your account is under review ✅");
        toast.info("You will receive an email once your account is approved");
        
        // Redirect to login
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        toast.error(res.error || "Registration failed ❌");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  const renderProgressBar = () => {
    const steps = ["Personal Info", "Store Details", "Payment Info", "Review"];
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep > index + 1 ? 'bg-green-600 text-white' :
                currentStep === index + 1 ? 'bg-blue-600 text-white' :
                'bg-gray-300 text-gray-600'
              }`}>
                {currentStep > index + 1 ? '✓' : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-full h-1 mx-2 ${
                  currentStep > index + 1 ? 'bg-green-600' : 'bg-gray-300'
                }`}></div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <span key={index} className={`text-xs ${
              currentStep === index + 1 ? 'text-blue-600 font-medium' : 'text-gray-500'
            }`}>
              {step}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Become a Seller
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Start selling your products to thousands of customers
          </p>
        </div>

        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Registration Form */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h2>
                
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  {formData.email && !isValidEmail(formData.email) && (
                    <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  {formData.phone && !isValidPhone(formData.phone) && (
                    <p className="text-red-500 text-sm mt-1">Please enter a valid phone number</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        )}
                      </svg>
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Password Strength</span>
                        <span className={`text-sm font-medium ${
                          passwordStrength <= 2 ? 'text-red-500' : 
                          passwordStrength <= 4 ? 'text-yellow-500' : 'text-green-500'
                        }`}>
                          {getStrengthText(passwordStrength)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`}
                          style={{ width: `${(passwordStrength / 6) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showConfirmPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        )}
                      </svg>
                    </button>
                  </div>
                  {formData.confirmPassword && (
                    <p className={`text-sm mt-1 ${
                      passwordRequirements.match ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {passwordRequirements.match ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </p>
                  )}
                </div>

                {/* Password Requirements */}
                {formData.password && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password Requirements:</p>
                    <div className="space-y-1">
                      <p className={`text-xs ${passwordRequirements.length ? "text-green-600" : "text-red-500"}`}>
                        ✓ At least 8 characters
                      </p>
                      <p className={`text-xs ${passwordRequirements.uppercase ? "text-green-600" : "text-red-500"}`}>
                        ✓ At least 1 uppercase letter
                      </p>
                      <p className={`text-xs ${passwordRequirements.lowercase ? "text-green-600" : "text-red-500"}`}>
                        ✓ At least 1 lowercase letter
                      </p>
                      <p className={`text-xs ${passwordRequirements.number ? "text-green-600" : "text-red-500"}`}>
                        ✓ At least 1 number
                      </p>
                      <p className={`text-xs ${passwordRequirements.special ? "text-green-600" : "text-red-500"}`}>
                        ✓ At least 1 special character
                      </p>
                      <p className={`text-xs ${passwordRequirements.match ? "text-green-600" : "text-red-500"}`}>
                        ✓ Passwords match
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Store Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Store Information</h2>
                
                {/* Store Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Store Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="storeName"
                      placeholder="My Awesome Store"
                      value={formData.storeName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Store Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Store Description *
                  </label>
                  <textarea
                    name="storeDescription"
                    placeholder="Tell customers about your store and what makes it special..."
                    value={formData.storeDescription}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Business Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Business Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="businessAddress"
                      placeholder="123 Business St, City, State, ZIP"
                      value={formData.businessAddress}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Business Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Business Type *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                      <input
                        type="radio"
                        name="businessType"
                        value="individual"
                        checked={formData.businessType === "individual"}
                        onChange={handleChange}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Individual</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Sole proprietor</div>
                      </div>
                    </label>
                    <label className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                      <input
                        type="radio"
                        name="businessType"
                        value="company"
                        checked={formData.businessType === "company"}
                        onChange={handleChange}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Company</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Registered business</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Store Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Store Logo (Optional)
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      {storeLogo ? (
                        <img src={URL.createObjectURL(storeLogo)} alt="Logo preview" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'logo')}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Choose Logo
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PNG, JPG up to 2MB</p>
                    </div>
                  </div>
                </div>

                {/* Store Banner Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Store Banner (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                    {storeBanner ? (
                      <div className="relative">
                        <img src={URL.createObjectURL(storeBanner)} alt="Banner preview" className="w-full h-32 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => setStoreBanner(null)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div>
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'banner')}
                          className="hidden"
                          id="banner-upload"
                        />
                        <label
                          htmlFor="banner-upload"
                          className="cursor-pointer text-blue-600 hover:text-blue-500"
                        >
                          Upload banner image
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Recommended: 1200x300px</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tax ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tax / Business Registration Number (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="taxId"
                      placeholder="Tax ID or Business Registration Number"
                      value={formData.taxId}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment Information */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Payment Information</h2>
                
                {/* Bank Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bank Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="bankName"
                      placeholder="Bank of America"
                      value={formData.bankName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Account Holder Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Account Holder Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="accountHolder"
                      placeholder="John Doe"
                      value={formData.accountHolder}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Bank Account Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bank Account Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="bankAccount"
                      placeholder="1234567890"
                      value={formData.bankAccount}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Routing Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Routing Number (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="routingNumber"
                      placeholder="123456789"
                      value={formData.routingNumber}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* ID Verification */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ID Verification (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                    {idDocument ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <svg className="w-8 h-8 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{idDocument.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIdDocument(null)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div>
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                        </svg>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange(e, 'id')}
                          className="hidden"
                          id="id-upload"
                        />
                        <label
                          htmlFor="id-upload"
                          className="cursor-pointer text-blue-600 hover:text-blue-500"
                        >
                          Upload ID document
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Driver's license, passport, or national ID</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Security Notice */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                      <p className="font-medium">Secure Payment Processing</p>
                      <p>Your payment information is encrypted and securely stored. We never share your financial details.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Review Your Information</h2>
                
                {/* Review Summary */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Personal Information</h3>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Name:</span> {formData.fullName}</p>
                        <p><span className="font-medium">Email:</span> {formData.email}</p>
                        <p><span className="font-medium">Phone:</span> {formData.phone}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Store Information</h3>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Store:</span> {formData.storeName}</p>
                        <p><span className="font-medium">Type:</span> {formData.businessType}</p>
                        <p><span className="font-medium">Address:</span> {formData.businessAddress}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Payment Information</h3>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Bank:</span> {formData.bankName}</p>
                        <p><span className="font-medium">Account:</span> ****{formData.bankAccount.slice(-4)}</p>
                        <p><span className="font-medium">Holder:</span> {formData.accountHolder}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Additional Information</h3>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Tax ID:</span> {formData.taxId || 'Not provided'}</p>
                        <p><span className="font-medium">Logo:</span> {storeLogo ? 'Uploaded' : 'Not uploaded'}</p>
                        <p><span className="font-medium">Banner:</span> {storeBanner ? 'Uploaded' : 'Not uploaded'}</p>
                        <p><span className="font-medium">ID:</span> {idDocument ? 'Uploaded' : 'Not uploaded'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="seller-terms"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                  />
                  <label htmlFor="seller-terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    I agree to the{" "}
                    <Link to="/seller-terms" className="text-blue-600 hover:text-blue-700 underline">
                      Seller Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link to="/seller-policy" className="text-blue-600 hover:text-blue-700 underline">
                      Seller Policies
                    </Link>. I understand that my account will be reviewed before activation.
                  </label>
                </div>

                {/* Final Notice */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex">
                    <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-yellow-800 dark:text-yellow-200">
                      <p className="font-medium">Account Review Process</p>
                      <p>Your seller account will be reviewed within 1-2 business days. You'll receive an email once your account is approved.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Previous
                </button>
              )}
              
              {currentStep < 4 && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ml-auto"
                >
                  Next
                </button>
              )}
              
              {currentStep === 4 && (
                <button
                  type="submit"
                  disabled={loading || !agreeToTerms}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center ml-auto"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Complete Registration"
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Already have a seller account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign In
            </Link>
          </p>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Want to register as a customer?{" "}
            <Link to="/register" className="text-green-600 hover:text-green-700 font-medium">
              Customer Registration
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

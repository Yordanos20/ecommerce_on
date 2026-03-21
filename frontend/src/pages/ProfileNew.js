import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  FiUser,
  FiLock,
  FiMail,
  FiPhone,
  FiCreditCard,
  FiHome,
  FiCalendar,
  FiSettings,
  FiTrash2,
  FiEdit,
  FiPlus,
  FiCamera,
  FiUpload
} from "react-icons/fi";
import Footer from "../components/Footer";

export default function Profile({ darkMode }) {
  const {
    user,
    updateProfile,
    updatePassword,
    fetchAddresses,
    fetchPayments,
    addAddress,
    updateAddress,
    deleteAddress,
    addPayment,
    updatePayment,
    deletePayment
  } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("Personal Info");
  const tabs = [
    "Personal Info",
    "Account & Security",
    "Addresses & Shipping",
    "Payment Methods"
  ];

  // Personal Info form
  const [personalData, setPersonalData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dob: user?.dob || "",
    gender: user?.gender || ""
  });

  // Security form
  const [username, setUsername] = useState(user?.username || "");
  const [password, setPassword] = useState("");
  const [twoFA, setTwoFA] = useState(user?.twoFA || false);

  // Addresses & Payments
  const [addresses, setAddresses] = useState([]);
  const [payments, setPayments] = useState([]);

  // Image upload
  const [profileImage, setProfileImage] = useState(user?.avatar || "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // For editing / adding
  const [addressForm, setAddressForm] = useState({
    id: null,
    name: "",
    phone: "",
    street: "",
    city: "",
    country: "",
    instructions: ""
  });

  const [paymentForm, setPaymentForm] = useState({
    id: null,
    type: "",
    last4: "",
    nickname: ""
  });

  const [addressMode, setAddressMode] = useState("add");
  const [paymentMode, setPaymentMode] = useState("add");

  // Fetch addresses and payments
  useEffect(() => {
    if (user?.id) {
      fetchAddresses(user.id).then(setAddresses);
      fetchPayments(user.id).then(setPayments);
    }
  }, [user]);

  // Image upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('userId', user.id);

      // Simulate upload (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a preview URL
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      
      toast.success('Profile image updated successfully!');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handlers
  const handlePersonalChange = (e) =>
    setPersonalData({ ...personalData, [e.target.name]: e.target.value });

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const res = await updateProfile({...personalData, avatar: profileImage});
      if (res.success) toast.success("Profile updated!");
      else toast.error(res.error || "Update failed");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!password) return toast.error("Enter a new password");
    setPasswordLoading(true);
    try {
      const res = await updatePassword(password);
      if (res.success) {
        toast.success("Password updated!");
        setPassword("");
      } else toast.error(res.error || "Update failed");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setPasswordLoading(false);
    }
  };

  // Address Handlers
  const handleAddressSubmit = async () => {
    if (!addressForm.name || !addressForm.street) {
      return toast.error("Name and Street are required");
    }
    try {
      if (addressMode === "add") {
        const newAddr = await addAddress(user.id, addressForm);
        setAddresses([...addresses, newAddr]);
        toast.success("Address added!");
      } else {
        const updatedAddr = await updateAddress(addressForm.id, addressForm);
        setAddresses(addresses.map(a => (a.id === updatedAddr.id ? updatedAddr : a)));
        toast.success("Address updated!");
      }
      setAddressForm({ id: null, name: "", phone: "", street: "", city: "", country: "", instructions: "" });
      setAddressMode("add");
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleAddressEdit = (addr) => {
    setAddressForm(addr);
    setAddressMode("edit");
  };

  const handleAddressDelete = async (id) => {
    try {
      await deleteAddress(id);
      setAddresses(addresses.filter(a => a.id !== id));
      toast.success("Address deleted!");
    } catch {
      toast.error("Failed to delete");
    }
  };

  // Payment Handlers
  const handlePaymentSubmit = async () => {
    if (!paymentForm.type || !paymentForm.last4) {
      return toast.error("Type and Last 4 digits are required");
    }
    try {
      if (paymentMode === "add") {
        const newCard = await addPayment(user.id, paymentForm);
        setPayments([...payments, newCard]);
        toast.success("Payment method added!");
      } else {
        const updatedCard = await updatePayment(paymentForm.id, paymentForm);
        setPayments(payments.map(p => (p.id === updatedCard.id ? updatedCard : p)));
        toast.success("Payment method updated!");
      }
      setPaymentForm({ id: null, type: "", last4: "", nickname: "" });
      setPaymentMode("add");
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handlePaymentEdit = (card) => {
    setPaymentForm(card);
    setPaymentMode("edit");
  };

  const handlePaymentDelete = async (id) => {
    try {
      await deletePayment(id);
      setPayments(payments.filter(p => p.id !== id));
      toast.success("Payment deleted!");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className={`${darkMode ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"} min-h-screen flex flex-col transition-all duration-700`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-8">
        
        {/* PROFILE HEADER */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
            Manage your personal information, security settings, addresses, and payment methods
          </p>
        </motion.div>

        {/* PROFILE IMAGE UPLOAD */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-xl">
              {profileImage ? (
                <img
                  src={profileImage.startsWith('blob:') ? profileImage : `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                  <FiUser className="w-16 h-16 text-white" />
                </div>
              )}
            </div>
            
            {/* Upload Button */}
            <button
              onClick={triggerFileInput}
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110"
            >
              {uploading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <FiCamera className="w-5 h-5" />
              )}
            </button>
            
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </motion.div>

        {/* TABS */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {tabs.map(tab => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                whileHover={{ scale: 1.05 }}
                className={`flex-1 px-6 py-4 font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : darkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {tab}
              </motion.button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <div className="p-6 md:p-8">
            {/* PERSONAL INFO */}
            {activeTab === "Personal Info" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FiUser className="inline mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={personalData.name}
                      onChange={handlePersonalChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FiMail className="inline mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={personalData.email}
                      onChange={handlePersonalChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FiPhone className="inline mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={personalData.phone}
                      onChange={handlePersonalChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FiCalendar className="inline mr-2" />
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={personalData.dob}
                      onChange={handlePersonalChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FiSettings className="inline mr-2" />
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={personalData.gender}
                    onChange={handlePersonalChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating Profile...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FiPlus className="mr-2" />
                      Update Personal Information
                    </span>
                  )}
                </motion.button>
              </motion.div>
            )}

            {/* ACCOUNT & SECURITY */}
            {activeTab === "Account & Security" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FiUser className="inline mr-2" />
                      Username / Display Name
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="johndoe"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FiLock className="inline mr-2" />
                      New Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center space-y-4">
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                    <FiSettings className="mr-2" />
                    Two-Factor Authentication
                  </label>
                  <button
                    onClick={() => setTwoFA(!twoFA)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      twoFA ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block w-4 h-4 rounded-full transition-transform ${
                      twoFA ? 'translate-x-6 bg-white' : 'translate-x-1 bg-white'
                    }`} />
                  </button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePasswordChange}
                  disabled={passwordLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {passwordLoading ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating Security...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FiLock className="mr-2" />
                      Update Security Settings
                    </span>
                  )}
                </motion.button>
              </motion.div>
            )}

            {/* ADDRESSES & SHIPPING */}
            {activeTab === "Addresses & Shipping" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Address Form */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <FiHome className="mr-2" />
                    {addressMode === "add" ? "Add New Address" : "Edit Address"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={addressForm.name}
                      onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={addressForm.street}
                      onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Country"
                      value={addressForm.country}
                      onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Delivery Instructions"
                      value={addressForm.instructions}
                      onChange={(e) => setAddressForm({ ...addressForm, instructions: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddressSubmit}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
                  >
                    <FiPlus className="mr-2" />
                    {addressMode === "add" ? "Add Address" : "Update Address"}
                  </motion.button>
                </div>

                {/* Address List */}
                {addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <motion.div
                        key={addr.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">{addr.name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{addr.phone}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {addr.street}, {addr.city}, {addr.country}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleAddressEdit(addr)}
                                className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                              >
                                <FiEdit />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleAddressDelete(addr.id)}
                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                              >
                                <FiTrash2 />
                              </motion.button>
                            </div>
                          </div>
                          {addr.instructions && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Instructions: {addr.instructions}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FiHome className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No saved addresses</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setAddressMode("add")}
                      className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FiPlus className="mr-2" />
                      Add Your First Address
                    </motion.button>
                  </div>
                )}
              </motion.div>
            )}

            {/* PAYMENT METHODS */}
            {activeTab === "Payment Methods" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Payment Form */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <FiCreditCard className="mr-2" />
                    {paymentMode === "add" ? "Add New Payment Method" : "Edit Payment Method"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Card Type (Visa, MasterCard, etc.)"
                      value={paymentForm.type}
                      onChange={(e) => setPaymentForm({ ...paymentForm, type: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Last 4 digits"
                      value={paymentForm.last4}
                      onChange={(e) => setPaymentForm({ ...paymentForm, last4: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      maxLength={4}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Card Nickname (Optional)"
                      value={paymentForm.nickname}
                      onChange={(e) => setPaymentForm({ ...paymentForm, nickname: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePaymentSubmit}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg"
                  >
                    <FiPlus className="mr-2" />
                    {paymentMode === "add" ? "Add Payment Method" : "Update Payment Method"}
                  </motion.button>
                </div>

                {/* Payment Methods List */}
                {payments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {payments.map((card) => (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {card.nickname || card.type}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                **** **** **** {card.last4}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{card.type}</p>
                            </div>
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handlePaymentEdit(card)}
                                className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                              >
                                <FiEdit />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handlePaymentDelete(card.id)}
                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                              >
                                <FiTrash2 />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FiCreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No saved payment methods</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setPaymentMode("add")}
                      className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FiPlus className="mr-2" />
                      Add Your First Payment Method
                    </motion.button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

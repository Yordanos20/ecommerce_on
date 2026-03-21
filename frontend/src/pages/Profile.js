// frontend/src/pages/Profile.js
import { useContext, useState, useEffect } from "react";
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
  FiPlus
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
    "Payment Methods",
  ];

  // Personal Info form
  const [personalData, setPersonalData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dob: user?.dob || "",
    gender: user?.gender || "",
  });

  // Security form
  const [username, setUsername] = useState(user?.username || "");
  const [password, setPassword] = useState("");
  const [twoFA, setTwoFA] = useState(user?.twoFA || false);

  // Addresses & Payments
  const [addresses, setAddresses] = useState([]);
  const [payments, setPayments] = useState([]);

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

  const [addressMode, setAddressMode] = useState("add"); // "add" or "edit"
  const [paymentMode, setPaymentMode] = useState("add");

  // Fetch addresses and payments
  useEffect(() => {
    if (user?.id) {
      fetchAddresses(user.id).then(setAddresses);
      fetchPayments(user.id).then(setPayments);
    }
  }, [user]);

  // Handlers
  const handlePersonalChange = (e) =>
    setPersonalData({ ...personalData, [e.target.name]: e.target.value });

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const res = await updateProfile(personalData);
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
    <div className={`${darkMode ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-900"} min-h-screen flex flex-col transition-all duration-700`}>
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 space-y-12">

        {/* PROFILE HEADER */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-600 p-6 rounded-3xl shadow-2xl transform hover:scale-[1.02] transition-all duration-500"
        >
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-xl">
            <img
              src={user?.avatar || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"}
              alt="profile"
              className="w-full h-full object-cover hover:scale-110 transition duration-500"
            />
          </div>
          <div className="flex-1 space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">{user?.name || "Customer"}</h1>
            <span className="inline-block px-3 py-1 rounded-full bg-white/30 text-white text-sm">{user?.role || "Customer"}</span>
            <p className="text-white/80 text-sm md:text-base mt-2">Manage your account, security, addresses, and payments here.</p>
          </div>
        </motion.div>

        {/* TABS */}
        <div className="flex gap-4 border-b border-gray-300 dark:border-gray-700 overflow-x-auto">
          {tabs.map(tab => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.05 }}
              className={`px-4 py-2 rounded-t-lg font-medium transition ${
                activeTab === tab
                  ? "bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 text-white shadow-lg"
                  : darkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6 min-h-[70vh]">

          {/* PERSONAL INFO */}
          {activeTab === "Personal Info" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200"><FiUser /> Full Name</div>
                <input type="text" name="name" value={personalData.name} onChange={handlePersonalChange} className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                <div className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200"><FiMail /> Email</div>
                <input type="email" name="email" value={personalData.email} onChange={handlePersonalChange} className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                <div className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200"><FiPhone /> Phone</div>
                <input type="text" name="phone" value={personalData.phone} onChange={handlePersonalChange} className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                <div className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200"><FiCalendar /> Date of Birth</div>
                <input type="date" name="dob" value={personalData.dob} onChange={handlePersonalChange} className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                <div className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200"><FiSettings /> Gender</div>
                <select name="gender" value={personalData.gender} onChange={handlePersonalChange} className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <button onClick={handleUpdateProfile} disabled={loading} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all duration-300 shadow-md hover:shadow-lg">{loading ? "Updating..." : "Update Personal Info"}</button>
            </motion.div>
          )}

          {/* ACCOUNT & SECURITY */}
          {activeTab === "Account & Security" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200"><FiUser /> Username / Display Name</div>
                <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                <div className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200"><FiLock /> New Password</div>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter new password" className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"/>
                <div className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200">Two-Factor Authentication</div>
                <input type="checkbox" checked={twoFA} onChange={()=>setTwoFA(!twoFA)} className="w-6 h-6"/>
              </div>
              <button onClick={handlePasswordChange} disabled={passwordLoading} className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 transition-all duration-300 shadow-md hover:shadow-lg">{passwordLoading ? "Updating..." : "Update Security Settings"}</button>
            </motion.div>
          )}

          {/* ADDRESSES & SHIPPING */}
          {activeTab === "Addresses & Shipping" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

              {/* ADDRESS FORM */}
              <div className="border p-4 rounded-lg dark:border-gray-700">
                <h3 className="font-semibold mb-2 flex items-center gap-2"><FiHome /> {addressMode === "add" ? "Add New Address" : "Edit Address"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input type="text" placeholder="Full Name" value={addressForm.name} onChange={e=>setAddressForm({...addressForm, name:e.target.value})} className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white"/>
                  <input type="text" placeholder="Phone" value={addressForm.phone} onChange={e=>setAddressForm({...addressForm, phone:e.target.value})} className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white"/>
                  <input type="text" placeholder="Street" value={addressForm.street} onChange={e=>setAddressForm({...addressForm, street:e.target.value})} className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white"/>
                  <input type="text" placeholder="City" value={addressForm.city} onChange={e=>setAddressForm({...addressForm, city:e.target.value})} className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white"/>
                  <input type="text" placeholder="Country" value={addressForm.country} onChange={e=>setAddressForm({...addressForm, country:e.target.value})} className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white"/>
                  <input type="text" placeholder="Delivery Instructions" value={addressForm.instructions} onChange={e=>setAddressForm({...addressForm, instructions:e.target.value})} className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white"/>
                </div>
                <button onClick={handleAddressSubmit} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">{addressMode === "add" ? "Add Address" : "Update Address"}</button>
              </div>

              {/* ADDRESS LIST */}
              {addresses.length > 0 ? (
                <ul className="space-y-2">
                  {addresses.map(addr => (
                    <li key={addr.id} className="p-4 border rounded-lg flex justify-between items-center dark:border-gray-700">
                      <div>
                        <p className="font-semibold">{addr.name} - {addr.phone}</p>
                        <p>{addr.street}, {addr.city}, {addr.country}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Instructions: {addr.instructions || "None"}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={()=>handleAddressEdit(addr)} className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"><FiEdit /></button>
                        <button onClick={()=>handleAddressDelete(addr.id)} className="p-2 bg-red-500 text-white rounded hover:bg-red-600"><FiTrash2 /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-gray-500">No saved addresses.</p>}
            </motion.div>
          )}

          {/* PAYMENT METHODS */}
          {activeTab === "Payment Methods" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

              {/* PAYMENT FORM */}
              <div className="border p-4 rounded-lg dark:border-gray-700">
                <h3 className="font-semibold mb-2 flex items-center gap-2"><FiCreditCard /> {paymentMode === "add" ? "Add New Payment" : "Edit Payment"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input type="text" placeholder="Card Type (Visa, MasterCard)" value={paymentForm.type} onChange={e=>setPaymentForm({...paymentForm, type:e.target.value})} className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white"/>
                  <input type="text" placeholder="Last 4 digits" value={paymentForm.last4} onChange={e=>setPaymentForm({...paymentForm, last4:e.target.value})} className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white"/>
                  <input type="text" placeholder="Nickname / Label" value={paymentForm.nickname} onChange={e=>setPaymentForm({...paymentForm, nickname:e.target.value})} className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white"/>
                </div>
                <button onClick={handlePaymentSubmit} className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">{paymentMode === "add" ? "Add Payment" : "Update Payment"}</button>
              </div>

              {/* PAYMENT LIST */}
              {payments.length > 0 ? (
                <ul className="space-y-2">
                  {payments.map(card => (
                    <li key={card.id} className="flex justify-between p-4 border rounded-lg items-center dark:border-gray-700">
                      <div>
                        <p className="font-semibold">{card.nickname || card.type} - **** **** **** {card.last4}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{card.type}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={()=>handlePaymentEdit(card)} className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"><FiEdit /></button>
                        <button onClick={()=>handlePaymentDelete(card.id)} className="p-2 bg-red-500 text-white rounded hover:bg-red-600"><FiTrash2 /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-gray-500">No saved payment methods.</p>}
            </motion.div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}
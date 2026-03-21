// frontend/src/pages/seller/SellerSettings.js
function SellerSettings() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Seller Settings</h1>
      <p>Configure your account, password, and notification preferences here.</p>
      <div className="border p-4 rounded-md space-y-2">
        <button className="px-4 py-2 bg-gray-800 text-white rounded">Change Password</button>
        <button className="px-4 py-2 bg-gray-800 text-white rounded">Notification Preferences</button>
      </div>
    </div>
  );
}

export default SellerSettings;
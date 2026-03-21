// frontend/src/pages/seller/SellerProfile.js
function SellerProfile() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Seller Profile</h1>
      <p>Here you can view and edit your personal information like name, email, and contact info.</p>
      <div className="border p-4 rounded-md">
        <p><strong>Name:</strong> John Doe</p>
        <p><strong>Email:</strong> seller@example.com</p>
        <p><strong>Phone:</strong> +251 900 000 000</p>
        <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">Edit Profile</button>
      </div>
    </div>
  );
}

export default SellerProfile;
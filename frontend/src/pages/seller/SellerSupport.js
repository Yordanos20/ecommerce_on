// frontend/src/pages/seller/SellerSupport.js
function SellerSupport() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Seller Support</h1>
      <p>Contact support or access FAQs for help with your seller account.</p>
      <div className="border p-4 rounded-md space-y-2">
        <button className="px-4 py-2 bg-green-600 text-white rounded">Contact Support</button>
        <button className="px-4 py-2 bg-gray-600 text-white rounded">View FAQ</button>
      </div>
    </div>
  );
}

export default SellerSupport;
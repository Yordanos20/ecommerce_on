// frontend/src/pages/seller/SellerBilling.js
function SellerBilling() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Seller Billing</h1>
      <p>View your earnings, invoices, and billing information here.</p>
      <div className="border p-4 rounded-md space-y-2">
        <p><strong>Total Revenue:</strong> $1,250.00</p>
        <p><strong>Pending Payments:</strong> $300.00</p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded">View Invoices</button>
      </div>
    </div>
  );
}

export default SellerBilling;
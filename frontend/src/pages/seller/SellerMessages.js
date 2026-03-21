// frontend/src/pages/seller/SellerMessages.js
function SellerMessages() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Seller Messages</h1>
      <p>View and respond to messages from buyers or platform admins here.</p>
      <div className="border p-4 rounded-md space-y-2">
        <p><strong>John Buyer:</strong> Is the product available?</p>
        <p><strong>Mary Buyer:</strong> Can I get a discount?</p>
      </div>
    </div>
  );
}

export default SellerMessages;
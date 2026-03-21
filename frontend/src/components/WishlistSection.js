import React, { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";

const WishlistSection = () => {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);

  return (
    <div className="wishlist-section">
      <h2>My Wishlist</h2>

      {wishlist.length === 0 ? (
        <p>No items in wishlist.</p>
      ) : (
        <div className="wishlist-items">
          {wishlist.map((product) => (
            <div key={product.id} className="wishlist-item">

              <img src={product.image} alt={product.name} />

              <h3>{product.name}</h3>

              <p>${product.price}</p>

              <button onClick={() => removeFromWishlist(product.id)}>
                Remove
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistSection;
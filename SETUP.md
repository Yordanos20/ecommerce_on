# E-Commerce Setup Guide (Simple Layman Terms)

## What You Need
1. **Node.js** installed on your computer
2. **MySQL** database running
3. **Two folders**: `backend` and `frontend`

---

## STEP 1: Create the Database

1. Open **MySQL** (or phpMyAdmin, or any MySQL tool)
2. Run the SQL file: `database/schema.sql`
   - This creates all the tables: users, products, orders, cart, etc.

**Where to do it:**  
- Open MySQL command line or phpMyAdmin  
- Copy-paste the contents of `database/schema.sql`  
- Execute it

---

## STEP 2: Configure the Backend

1. Go to the **backend** folder
2. Make sure there is a `.env` file with:

```
DB_HOST=localhost
DB_USER=root
DB_PASS=161920
DB_NAME=ecommerce
PORT=5000
JWT_SECRET=secretkey123
```

3. Change `DB_PASS` to your MySQL password if different
4. Run: `npm install`
5. Start the server: `npm start` (or `npm run dev` for auto-restart)

**Where:** In a terminal, type:
```
cd backend
npm install
npm start
```

You should see: `Server running on http://localhost:5000`

---

## STEP 3: Configure the Frontend

1. Open a **new terminal**
2. Go to the **frontend** folder
3. Run: `npm install`
4. Start: `npm start`

**Where:**
```
cd frontend
npm install
npm start
```

The website opens at `http://localhost:3000`

---

## STEP 4: Use the Website

| What to do | Where to do it |
|------------|----------------|
| **Browse products** | Homepage or Products page |
| **Register** | Click Register → choose Customer or Seller |
| **Login** | Click Login → enter email & password |
| **Add to cart** | Click "Add to Cart" on any product |
| **View cart** | Click Cart in the navbar |
| **Checkout** | Cart → Proceed to Checkout → enter address → Place Order |
| **Customer dashboard** | Login as Customer → Dashboard → My Orders |
| **Seller dashboard** | Login as Seller → Dashboard → Seller Dashboard |
| **Admin dashboard** | Login as Admin → Dashboard → Admin Dashboard |

---

## File Structure (Where Things Live)

| Feature | Backend File | Frontend File |
|---------|--------------|---------------|
| Login/Register | `routes/users.js` | `pages/Login.js`, `pages/Register.js` |
| Products | `routes/products.js` | `pages/Products.js`, `pages/ProductDetail.js` |
| Cart | `routes/cart.js` | `pages/Cart.js`, `context/CartContext.js` |
| Orders | `routes/orders.js` | `pages/Checkout.js`, `pages/CustomerDashboard.js` |
| Returns | `routes/returns.js` | `pages/Returns.js` |
| Shipping | `routes/shipping.js` | `pages/Shipping.js` |
| Notifications | `routes/notifications.js` | `pages/Notifications.js` |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Cannot connect to database" | Check MySQL is running, and `.env` has correct DB_PASS |
| "Invalid token" on login | Clear browser localStorage, login again |
| Products not loading | Make sure backend is running on port 5000 |
| Cart empty after refresh | Cart is stored in browser; login to persist (or use DB cart) |

---

## Quick Test

1. Register a new **Customer** account
2. Login
3. Go to Products → Add 1–2 items to cart
4. Go to Cart → Proceed to Checkout
5. Enter address, click Place Order
6. Go to Customer Dashboard → you should see your order

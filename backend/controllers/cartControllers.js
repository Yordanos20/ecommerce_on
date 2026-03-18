const db = require("../config/db");

const query = (sql, values = []) =>
    new Promise((resolve, reject) => {
        db.query(sql, values, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });

// GET - User's cart
exports.getCart = async (req, res) => {
    try {
        const user_id = req.user.id;
        let carts = await query("SELECT id FROM carts WHERE user_id = ?", [user_id]);
        if (carts.length === 0) return res.json([]);

        const cart_id = carts[0].id;
        const items = await query(
            `SELECT ci.*, p.name, p.price, p.image, p.stock 
       FROM cart_items ci 
       JOIN products p ON ci.product_id = p.id 
       WHERE ci.cart_id = ?`,
            [cart_id]
        );
        res.json(items.map((row) => ({ ...row, quantity: row.quantity })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST - Add to cart
exports.addToCart = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { product_id, quantity = 1 } = req.body;

        let carts = await query("SELECT id FROM carts WHERE user_id = ?", [user_id]);
        let cart_id;

        if (carts.length === 0) {
            const insert = await query("INSERT INTO carts (user_id) VALUES (?)", [user_id]);
            cart_id = insert.insertId;
        } else {
            cart_id = carts[0].id;
        }

        const existing = await query("SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?", [
            cart_id,
            product_id,
        ]);

        if (existing.length > 0) {
            // Prevent adding more than stock if possible, but for MVP just add
            await query("UPDATE cart_items SET quantity = quantity + ? WHERE id = ?", [
                quantity,
                existing[0].id,
            ]);
        } else {
            await query("INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)", [
                cart_id,
                product_id,
                quantity,
            ]);
        }

        res.json({ message: "Added to cart ✅" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PUT - Update cart item quantity
exports.updateCartItem = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { quantity } = req.body;
        const product_id = req.params.productId;

        const carts = await query("SELECT id FROM carts WHERE user_id = ?", [user_id]);
        if (carts.length === 0) return res.status(404).json({ error: "Cart not found" });

        const result = await query(
            "UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?",
            [quantity, carts[0].id, product_id]
        );

        if (result.affectedRows === 0) return res.status(404).json({ error: "Item not found" });

        res.json({ message: "Cart updated ✅" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE - Remove from cart
exports.removeFromCart = async (req, res) => {
    try {
        const user_id = req.user.id;
        const product_id = req.params.productId;

        const carts = await query("SELECT id FROM carts WHERE user_id = ?", [user_id]);
        if (carts.length === 0) return res.json({ message: "Cart empty" });

        await query("DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?", [
            carts[0].id,
            product_id,
        ]);
        res.json({ message: "Removed from cart ✅" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

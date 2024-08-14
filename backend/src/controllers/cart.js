import Cart from "../models/cart.model.js";
import Order from "../models/orders.model.js";
import Product from "../models/Products.model.js";

export const manageCartItems = async (req, res) => {
    console.log(req.method);

    if (req.method === 'GET') {
        try {
            const cart = await Cart.findOne({ user: req.user._id }).populate('products.product').exec();
            if (!cart) {
                return res.status(404).json({ message: 'No Cart Items Found' });
            }
            return res.status(200).json(cart);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error fetching cart', error: error.message });
        }
    } else if (req.method === 'POST') {
        try {
            const { productId } = req.body;
            const userId = req.user._id;

            if (!userId || !productId) {
                return res.status(400).json({ message: 'User ID and Product ID are required' });
            }

            let cart = await Cart.findOne({ user: userId });
            let product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({ message: 'Product Not Found' });
            }

            if (!cart) {
                cart = new Cart({
                    user: userId,
                    products: []
                });
            }

            const existingProduct = cart.products.find(p => p.product.toString() === productId);

            if (existingProduct) {
                existingProduct.count++;
            } else {
                cart.products.push({ product: productId, count: 1 });
            }

            await cart.save();
            return res.status(200).json({ message: 'Product added to cart successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error adding product to cart', error: error.message });
        }
    } else if (req.method === 'DELETE') {
        try {
            const { productId } = req.params;
            const userId = req.user._id;

            if (!userId || !productId) {
                return res.status(400).json({ message: 'User ID and Product ID are required' });
            }

            const product = await Product.findById(productId);
            const cart = await Cart.findOne({ user: userId });

            if (!product) {
                return res.status(404).json({ message: 'Product Not Found' });
            }

            if (!cart) {
                return res.status(404).json({ message: 'Cart Not Found' });
            }

            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

            if (productIndex === -1) {
                return res.status(404).json({ message: 'Product Not Found in Cart' });
            }

            if (cart.products[productIndex].count > 1) {
                cart.products[productIndex].count--;
            } else {
                cart.products.splice(productIndex, 1); // Remove the product from cart
            }

            await cart.save();
            return res.status(200).json({ message: 'Product removed from cart successfully', cart });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error removing product from cart', error: error.message });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export const removeProductFromCart = async (req, res) => {
    try {
        const productId = req.body; // Assuming productId is coming from the request body
        const userId = req.user._id;

        if (!userId || !productId) {
            return res.status(400).json({ message: 'User ID and Product ID are required' });
        }
        const product = await Product.findById(productId)
        const cart = await Cart.findOne({ user: userId });
        if (!product) {
            return res.status(404).json({ message: 'Product Not Found' });
        }
        if (!cart) {
            return res.status(404).json({ message: 'Cart Not Found' });
        }

        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product Not Found in Cart' });
        }
        cart.products.splice(productIndex, 1); // Remove the product from cart

        await cart.save();

        res.status(200).json({ message: 'Product removed from cart successfully', cart });
    } catch (err) {
        res.status(500).json({ message: 'Error removing product from cart', error: err.message });
    }
};

export const deleteCart = async (req, res) => {
    try {
        const userId = req.user._id;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const result = await Cart.deleteOne({ user: userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Cart Not Found' });
        }

        res.status(200).json({ message: 'Cart deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting cart', error: err.message });
    }
};

export const paymentCheckOut = async (req, res) => {
    const { amount } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Amount in cents
            currency: 'usd',
            payment_method_types: ['card'],
        });

        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

export const checkOut = async (req, res) => {
    try {
        const _id = req.user._id;
        const cart = await Cart.findOne({ user: _id }).populate('products.product'); // Populate product details

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        const totalPrice = cart.products.reduce((sum, item) => {
            if (item.product && item.product.price) {
                return sum + item.product.price * item.count;
            }
            return sum;
        }, 0);

        await Promise.all(cart.products.map(async (item) => {
            try {
                
                const product = await Product.findById(item.product._id);
                if (product) {
                    product.noOfOrders = (product.noOfOrders || 0) + item.count;
                    await product.save();
                }
            } catch (error) {
                console.error('Error updating product:', error);
            }
        }));
        await Cart.deleteOne({user: _id})

        const order = new Order({
            user: _id,
            products: cart.products,
            price: totalPrice,
        });
        await order.save();
        res.json({ message: 'Order placed successfully' });

    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
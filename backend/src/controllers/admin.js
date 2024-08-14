import { bucket } from '../firebaseAdmin.js'; // Adjust path as needed
import Product from '../models/Products.model.js';
import { v4 as uuidv4 } from 'uuid'; // To generate unique filenames
import path from 'path';
import Order from '../models/orders.model.js';


export const addProduct = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        // Log received data
        console.log('Received file:', req.file);
        console.log('Received body:', req.body);

        const blob = bucket.file(`images/${uuidv4()}${path.extname(req.file.originalname)}`);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: req.file.mimetype,
            },
        });

        blobStream.on('error', (err) => {
            console.error(err);
            res.status(500).send('Unable to upload image.');
        });

        blobStream.on('finish', async () => {
            // Get the signed URL for the uploaded file
            const [url] = await blob.getSignedUrl({
                action: 'read',
                expires: '03-09-2491', // Expiry date for the signed URL
            });

            const productData = {
                name: req.body.name,
                price: req.body.price,
                image: url, // Use the signed URL
            };

            const product = new Product({
                name: req.body.name,
                price: req.body.price,
                image: url,
            });

            await product.save();

            res.status(200).json(productData);
        });

        blobStream.end(req.file.buffer);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
};

export const getAdminData = async (req, res) => {
    try {
        const topSellingProducts = await Product.aggregate([
            { $match: { noOfOrders: { $gt: 0 } } },
            { $sort: { noOfOrders: -1 } },
            { $limit: 10 },
            { $project: { name: 1, noOfOrders: 1 } }
        ]);

        const ordersPerDay = await Order.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const orderHistory = await Order.find().populate('user').populate('products.product').sort({ createdAt: -1 });

        const orderHistoryData = orderHistory.map(order => ({
            _id: order._id,
            username: order.user.username,
            numProducts: order.products.length,
            totalPrice: order.price,
            products: order.products.map(p => p.product.name),
            status: order.status === 1 ? 'Ordered' : 'Delivered'
        }));

        res.json({ topSellingProducts, ordersPerDay, orderHistory: orderHistoryData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const updateOrderStatus = async (req, res) => {
    const { orderId } = req.body;
    console.log(orderId);

    const order = await Order.findById(orderId);
    console.log(order);

    if (order) {
        order.status = 2;
        await order.save()
        res.json({ message: 'Order completed successfully' })
    } else {
        res.status(404).json({ message: 'Order Not Found' })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        await Product.findByIdAndDelete(productId);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete product', error });
    }
} 

export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const existingProduct = await Product.findById(productId);

        if (!existingProduct) {
            return res.status(404).send('Product not found.');
        }

        let imageUrl = existingProduct.image; // Default to existing image URL

        if (req.file) {
            // Delete the old image from Firebase
            const oldImagePath = imageUrl.split('/').pop().split('?')[0]; // Extract the file path from the URL
            const oldImageBlob = bucket.file(`images/${oldImagePath}`);
            await oldImageBlob.delete();

            // Upload the new image to Firebase
            const newImageBlob = bucket.file(`images/${uuidv4()}${path.extname(req.file.originalname)}`);
            const newBlobStream = newImageBlob.createWriteStream({
                metadata: {
                    contentType: req.file.mimetype,
                },
            });

            newBlobStream.on('error', (err) => {
                console.error(err);
                return res.status(500).send('Unable to upload new image.');
            });

            newBlobStream.on('finish', async () => {
                [imageUrl] = await newImageBlob.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491',
                });

                // Update the product with the new image URL
                await Product.findByIdAndUpdate(productId, {
                    name: req.body.name,
                    price: req.body.price,
                    image: imageUrl,
                    noOfOrders: req.body.noOfOrders
                });

                res.status(200).json({
                    message: 'Product updated successfully with new image.',
                    imageUrl,
                });
            });

            newBlobStream.end(req.file.buffer);
        } else {
            // Update the product without changing the image
            await Product.findByIdAndUpdate(productId, {
                name: req.body.name,
                price: req.body.price,
                noOfOrders: req.body.noOfOrders
            });

            res.status(200).json({
                message: 'Product updated successfully without changing the image.',
                imageUrl,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
};
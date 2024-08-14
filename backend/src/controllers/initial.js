import Product from "../models/Products.model.js"


export const getAllProducts = async (req, res) => {
    try {
        const data = await Product.find({})
        if (data) {
            res.status(200).json(data)
        } else {
            res.status(404).json({ message: 'Products Not Found' })
        }
    } catch (error) {
        console.log(error);
    }
}

export const giveRating = async (req, res) => {
    const { productId, rating } = req.body;

    const user = req.user._id

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product Not Found' });
        }
        const existingRatingIndex = product.rating.findIndex(r => r.user && r.user.toString() === user.toString());
        if (existingRatingIndex !== -1) {
            product.rating[existingRatingIndex].rating = rating;
        } else {
            if (!product.rating) {
                product.rating = []
            }
            product.rating= [...product.rating, {rating, user}];
        }
        
        await product.save();
        res.json({ message: 'Rating Updated Successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};
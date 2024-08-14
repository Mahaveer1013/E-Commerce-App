import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: true },
    rating: [{
        rating: { type: Number , default:0, enum:[0,1,2,3,4,5]},
        user: { type: Schema.Types.ObjectId, ref: 'User' }
    }],
    noOfOrders: { type: Number, requires: true, default:0 },
    price: { type: Number, requires: true },
    image: { type: String, required: true },
});

const Product = mongoose.model('Product', productSchema);

export default Product


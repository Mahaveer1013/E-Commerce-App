import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        count: { type: Number, required: true }
    }],
    price: { type: Number, required: true },
    status: {type: Number, required:true, default:1, enum:[1,2]} //1 for ordered, 2 for delivered
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order


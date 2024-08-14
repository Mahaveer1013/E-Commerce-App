import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    count: { type: Number, required: true }
  }],
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

export default Cart


import { Schema } from "mongoose";
import mongoose from "mongoose";

const cartProduct = new Schema({
    "_id": false,
    pid: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
})


const cartSchema = new Schema({
    userId: { type: String, required: true, index: true },
    items: [cartProduct]
}, {timestamps: true});

export default mongoose.model('Cart', cartSchema);


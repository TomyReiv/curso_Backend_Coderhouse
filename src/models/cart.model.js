import { Schema } from "mongoose";
import mongoose from "mongoose";

const cartProduct = new Schema({
    "_id": false,
    pid: { type: String, },
    quantity: { type: Number, default: 1 }
})


const cartSchema = new Schema({
    userId: { type: String, required: true },
    items: [cartProduct]
}, {timestamps: true});

export default mongoose.model('Cart', cartSchema);


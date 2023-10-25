import { Schema } from "mongoose";
import mongoose from "mongoose";

const cartProduct = new Schema({
    pid: { type: String },
    quantity: { type: Number }
})


const cartSchema = new Schema({
    Products: { type:  cartProduct}
}, {timestamps: true});

export default mongoose.model('Cart', cartSchema);
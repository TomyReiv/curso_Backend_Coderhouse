import { Schema } from "mongoose";
import mongoose from "mongoose";


const productSchema = new Schema({
    title: { type: String, require: true },
    description: { type: String, require: true },
    price: { type: Number, required: true },
    thumbnail: { type: Array },
    code: { type: String, required: true, unique: true },
    status: { type: String, default: 'active', enum: ['active', 'inactive'] },
    stock: { type: Number, required: true },
    category: { type: String, require: true }
}, {timestamps: true});

export default mongoose.model('Product', productSchema);
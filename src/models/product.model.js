import { Schema } from "mongoose";
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";


const productSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, requiredd: true },
    thumbnail: { type: Array },
    code: { type: String, requiredd: true, unique: true },
    status: { type: String, default: 'active', enum: ['active', 'inactive'] },
    stock: { type: Number, requiredd: true },
    category: { type: String, required: true }
}, {timestamps: true});

productSchema.plugin(mongoosePaginate);
export default mongoose.model('Product', productSchema);
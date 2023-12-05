import { Schema } from "mongoose";
import mongoose from "mongoose";


const address = new Schema({
    "_id": false,
    street: {type: String},
    city: { type: String },
    country: { type: String }
});

const cartSubSchema = new Schema({
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }
})

const userSchema = new Schema({
    username: { type: String },
    lastname: { type: String },
    password: { type: String },
    email: { type: String, requiredd: true, unique: true, index: true },
    address: { type: address },
    status: { type: String, default: 'active', enum: ['active', 'inactive'] },
    rol: { type: String, default: 'user', enum: ['admin', 'user']  },
    cart: { type: cartSubSchema, default: null },
    provider: {type: String}
}, {timestamps: true});


export default mongoose.model('User', userSchema);
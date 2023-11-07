import { Schema } from "mongoose";
import mongoose from "mongoose";


const address = new Schema({
    "_id": false,
    street: {type: String, required: true},
    city: { type: String, requiredd: true },
    country: { type: String, requiredd: true }
});

const userSchema = new Schema({
    username: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, requiredd: true },
    email: { type: String, requiredd: true, unique: true, index: true },
    address: { type: address, requiredd: true },
    status: { type: String, default: 'active', enum: ['active', 'inactive'] }
}, {timestamps: true});

export default mongoose.model('User', userSchema);
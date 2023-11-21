import { Schema } from "mongoose";
import mongoose from "mongoose";


const address = new Schema({
    "_id": false,
    street: {type: String},
    city: { type: String },
    country: { type: String }
});

const userSchema = new Schema({
    username: { type: String },
    lastname: { type: String },
    password: { type: String },
    email: { type: String, requiredd: true, unique: true, index: true },
    address: { type: address },
    status: { type: String, default: 'active', enum: ['active', 'inactive'] },
    provider: {type: String}
}, {timestamps: true});

export default mongoose.model('User', userSchema);
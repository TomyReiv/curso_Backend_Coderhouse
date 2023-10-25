import { Schema } from "mongoose";
import mongoose from "mongoose";

const address = new Schema({
    street: {type: String, require: true},
    city: { type: String, required: true },
    country: { type: String, required: true }
});

const userSchema = new Schema({
    username: { type: String, require: true },
    lastname: { type: String, require: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: address, required: true },
    status: { type: String, default: 'active', enum: ['active', 'inactive'] }
}, {timestamps: true});

export default mongoose.model('User', userSchema);
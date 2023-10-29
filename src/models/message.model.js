import { Schema } from "mongoose";
import mongoose from "mongoose";


const messageSchema = new Schema({
    username: { type: String, required: true },
    message: { type:  String, required: true}
}, {timestamps: true});

export default mongoose.model('Message', messageSchema);


import mongoose from "mongoose";

const snakeSchema = new mongoose.Schema({}, { timestamps: true });
const Snake = mongoose.models.Snake || mongoose.model("Snake", snakeSchema);
export default Snake;

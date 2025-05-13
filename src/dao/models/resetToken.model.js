import mongoose from "mongoose";

const resetTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // Expira en 1 hora
  },
});

const ResetToken = mongoose.model("resetTokens", resetTokenSchema);

export default ResetToken;

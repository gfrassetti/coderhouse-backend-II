import mongoose from "mongoose";

const passwordResetTokenCollection = "passwordResetTokens";

const passwordResetTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 },
  },
  used: {
    type: Boolean,
    default: false,
  },
});

const passwordResetTokenModel = mongoose.model(
  passwordResetTokenCollection,
  passwordResetTokenSchema
);

export default passwordResetTokenModel;


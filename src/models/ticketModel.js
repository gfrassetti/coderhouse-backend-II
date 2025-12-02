import mongoose from "mongoose";

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    purchase_datetime: {
      type: Date,
      default: Date.now,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    purchaser: {
      type: String,
      required: true,
    },
    products: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
          },
          quantity: Number,
          price: Number,
        },
      ],
      default: [],
    },
    incompleteProducts: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
          },
          quantity: Number,
          reason: String,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const ticketModel = mongoose.model(ticketCollection, ticketSchema);

export default ticketModel;


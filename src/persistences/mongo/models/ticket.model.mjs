import mongoose from "mongoose";

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({
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
  },
  purchaser: {
    type: String,
    required: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
    required: true,
  },
});

ticketSchema.pre(["find", "findOne"], function () {
  this.populate({
    path: "cart",
    populate: {
      path: "products.product",
      model: "products",
    },
  });
});

export const ticketModel = mongoose.model(ticketCollection, ticketSchema);

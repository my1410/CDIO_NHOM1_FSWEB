const mongoose = require("mongoose");

const InventoryTransactionSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductModel",
      required: true,
    },

    type: {
      type: String,
      enum: ["import", "export", "adjust"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    oldStock: {
      type: Number,
      required: true,
    },

    newStock: {
      type: Number,
      required: true,
    },

    reason: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  "InventoryTransactionModel",
  InventoryTransactionSchema,
);

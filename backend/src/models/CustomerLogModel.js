const mongoose = require("mongoose");

const CustomerLogSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },

    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },

    action: {
      type: String,
      enum: ["LOCK_CUSTOMER", "UNLOCK_CUSTOMER", "UPDATE_CUSTOMER_STATUS"],
      required: true,
    },

    oldStatus: {
      type: String,
      default: "",
    },

    newStatus: {
      type: String,
      required: true,
    },

    reason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("CustomerLogModel", CustomerLogSchema);

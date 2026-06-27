import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  any_three_letter_of_your_name: {
    type: String,
    default: "",
  },
  phone_no: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  verificationTokenExpiry: {
    type: Date,
  },
  // ── ADD THESE TWO ──────────────────────────────────────────────
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
});

// Delete the cached model to ensure fresh schema on every load
if (mongoose.models.Owner) {
  delete mongoose.models.Owner;
}

const Owner = mongoose.model("Owner", ownerSchema);
export default Owner;

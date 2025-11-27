import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Owner = mongoose.models.Owner || mongoose.model("Owner", ownerSchema);
export default Owner;

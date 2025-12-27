import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  owner_id: {
    type: mongoose.Schema.ObjectId,
    ref: "Owner",
    required: true,
  },
});
const Member = mongoose.models.Member || mongoose.model("Member", memberSchema);
export default Member;

import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  member_id: {
    type: mongoose.Schema.ObjectId,
    ref: "Member",
    required: true,
  },
  test_category: {
    type: String,
    required: true,
  },
  test_parameter: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  where: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const Data = mongoose.models.Data || mongoose.model("Data", dataSchema);
export default Data;

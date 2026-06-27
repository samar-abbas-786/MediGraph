const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const envFile = path.join(process.cwd(), ".env.local");
const env = fs
  .readFileSync(envFile, "utf8")
  .split(/\r?\n/)
  .reduce((acc, line) => {
    const match = line.match(/^\s*([^#][^=]*)=(.*)$/);
    if (match) {
      acc[match[1].trim()] = match[2].trim();
    }
    return acc;
  }, {});

const uri = env.MONGO_URI;
if (!uri) {
  console.error("No MONGO_URI found");
  process.exit(1);
}

const schema = new mongoose.Schema(
  {
    member_id: mongoose.Schema.Types.ObjectId,
    test_category: String,
    test_parameter: String,
    value: mongoose.Schema.Types.Mixed,
    where: String,
    date: Date,
  },
  { strict: false },
);
const Data = mongoose.model("Data", schema, "datas");

(async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to", uri);
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "Collections:",
      collections.map((c) => c.name),
    );
    const total = await Data.countDocuments();
    console.log("Total Data docs:", total);
    const sample = await Data.find().limit(10).lean();
    console.log("Sample docs:", JSON.stringify(sample, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

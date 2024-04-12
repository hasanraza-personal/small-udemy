const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    adminid: { type: String, required: true },
    adminname: { type: String, required: true },
    coursename: { type: String, required: true },
    coursedesc: { type: String, required: true },
    pdf: { type: String, required: true },
    publicid: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);

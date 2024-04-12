const mongoose = require("mongoose");

const enrolledCourseSchema = new mongoose.Schema(
  {
    studentid: { type: String, required: true },
    courses: [],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("EnrolledCourse", enrolledCourseSchema);

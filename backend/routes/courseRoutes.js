const express = require("express");
const router = express.Router();
const courseModel = require("../models/Course.model.js");
const enrolledCourseModel = require("../models/EnrolledCourse.model.js");
const fetchUser = require("../middleware/FetchUser");
const userModel = require("../models/User.model.js");
const mongoose = require("mongoose");
const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Add course endpoint (admin only)
router.post("/addcourse", fetchUser, async (req, res) => {
  try {
    let success = false;
    let form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res
          .status(500)
          .json({ success, msg: "Error parsing form data", err: err.msg });
      }

      if (
        [fields.coursename[0], fields.coursedesc[0], files.pdf].some(
          (field) => field?.length === 0
        )
      ) {
        return res.status(400).json({
          success,
          msg: "Please fill all the required fields",
          err: null,
        });
      }

      // Find user in database
      const user = await userModel.findOne({
        _id: new mongoose.Types.ObjectId(req.user),
      });
      if (!user) {
        return res.status(401).json({
          success,
          msg: "Access denied, while adding course",
          err: null,
        });
      }

      // Check if user is admin
      if (user.role !== "admin") {
        return res
          .status(401)
          .json({ success, msg: "Only admin can add course", err: null });
      }

      // Uploading file in cloudinary
      const response = await cloudinary.uploader.upload(files.pdf[0].filepath, {
        resource_type: "auto",
      });

      const newCourse = await courseModel.create({
        adminid: req.user,
        adminname: user.fullname,
        coursename: fields.coursename[0],
        coursedesc: fields.coursedesc[0],
        pdf: response.url,
        publicid: response.public_id,
      });
      success = true;

      res
        .status(200)
        .json({ success, msg: "Course created successfully", newCourse });
    });
  } catch (error) {
    res.status(500).json({
      success,
      msg: "Something went wrong. Please try again",
      err: error.message,
    });
  }
});

// Remove course endpoint (admin only)
router.post("/deletecourse", fetchUser, async (req, res) => {
  try {
    const { courseid } = req.body;
    let success = false;

    if (courseid.trim() === 0) {
      return res.status(400).json({
        success,
        msg: "Course id is required",
        err: null,
      });
    }

    // Find user in database
    const user = await userModel.findOne({
      _id: new mongoose.Types.ObjectId(req.user),
    });

    if (!user) {
      return res.status(401).json({
        success,
        msg: "Access denied, while deleting course",
        err: null,
      });
    }

    // Check if user is admin
    if (user.role !== "admin") {
      return res
        .status(401)
        .json({ success, msg: "Only admin can delete course", err: null });
    }

    const response = await courseModel.findOne({
      _id: new mongoose.Types.ObjectId(courseid),
    });

    cloudinary.uploader.destroy(response.publicid, function (result) {
      console.log(result);
    });

    await courseModel.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(courseid),
    });

    res.status(200).json({ success, msg: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success,
      msg: "Something went wrong. Please try again",
      err: error.message,
    });
  }
});

// show all courses endpoint
router.get("/showcourses", fetchUser, async (req, res) => {
  try {
    let success = false;

    // Get all courses from database
    const courses = await courseModel.find({}).sort("-createdAt");

    success = true;
    res.status(200).json({ success, courses });
  } catch (error) {
    res.status(500).json({
      success,
      msg: "Something went wrong. Please try again",
      err: error.message,
    });
  }
});

// show admin courses
router.get("/showadmincourses", fetchUser, async (req, res) => {
  try {
    let success = false;
    // Find all admin courses
    const adminCourses = await courseModel
      .find({
        adminid: new mongoose.Types.ObjectId(req.user),
      })
      .sort("-createdAt");
    success = true;

    res.status(200).json({
      success,
      adminCourses,
    });
  } catch (error) {
    res.status(500).json({
      success,
      msg: "Something went wrong. Please try again",
      err: error.message,
    });
  }
});

// get student
router.get("/getstudentenrolledcourses", fetchUser, async (req, res) => {
  try {
    let success = false;
    // Find all admin courses
    const enrolledCourses = await enrolledCourseModel.findOne({
      studentid: req.user,
    });
    success = true;

    res.status(200).json({
      success,
      enrolledCourses,
    });
  } catch (error) {
    res.status(500).json({
      success,
      msg: "Something went wrong. Please try again",
      err: error.message,
    });
  }
});

// Enroll course
router.post("/enrollcourse", fetchUser, async (req, res) => {
  try {
    const { courseid } = req.body;
    let success = false;
    let enrolledCourses = null;

    if (courseid.trim() === 0) {
      return res.status(400).json({
        success,
        msg: "Course id is required",
        err: null,
      });
    }

    // Find user in database
    enrolledCourses = await enrolledCourseModel.findOne({
      studentid: new mongoose.Types.ObjectId(req.user),
    });

    if (!enrolledCourses) {
      enrolledCourses = await enrolledCourseModel.create({
        studentid: req.user,
        courses: courseid,
      });
    } else {
      if (enrolledCourses.courses.includes(courseid)) {
        return res.status(409).json({
          success,
          msg: "You are already enrolled in this course",
          err: null,
        });
      }
      enrolledCourses = await enrolledCourseModel.findOneAndUpdate(
        { studentid: new mongoose.Types.ObjectId(req.user) },
        {
          $push: {
            courses: courseid,
          },
        },
        { new: true }
      );
    }
    success = true;

    res
      .status(200)
      .json({ success, msg: "Successfully enrolled tin this course" });
  } catch (error) {
    return res.status(500).json({
      success,
      msg: "Something went wrong. Please try again",
      err: error.message,
    });
  }
});

// Disenroll course
router.post("/disenrollcourse", fetchUser, async (req, res) => {
  try {
    const { courseid } = req.body;
    let success = false;

    if (courseid.trim() === 0) {
      return res.status(400).json({
        success,
        msg: "Course id is required",
        err: null,
      });
    }

    const enrolledCourses = await enrolledCourseModel.findOneAndUpdate(
      { studentid: new mongoose.Types.ObjectId(req.user) },
      { $pull: { courses: courseid } },
      { new: true }
    );

    success = true;
    res.status(200).json({
      success,
      enrolledCourses,
    });
  } catch (error) {
    return res.status(500).json({
      success,
      msg: "Something went wrong. Please try again",
      err: error.message,
    });
  }
});

// Display list of enrolled courses
router.get("/showenrollcourse", fetchUser, async (req, res) => {
  try {
    let success = false;
    const studentCourse = [];
    // Find courses taken by user in database
    const enrolledCourses = await enrolledCourseModel.findOne({
      studentid: new mongoose.Types.ObjectId(req.user),
    });

    if (enrolledCourses) {
      for (let i = 0; i < enrolledCourses.courses.length; i++) {
        const course = await courseModel.findOne({
          _id: new mongoose.Types.ObjectId(enrolledCourses.courses[i]),
        });
        studentCourse.push(course);
      }
    }

    success = true;
    res.status(200).json({
      success,
      enrolledCourses: studentCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success,
      msg: "Something went wrong. Please try again",
      err: error.message,
    });
  }
});

module.exports = router;

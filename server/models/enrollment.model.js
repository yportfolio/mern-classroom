import mongoose from "mongoose";

/**
 * Every time a user enroll in a course, it will create a enrollment with the user id and courseId
 */
const EnrollmentSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.ObjectId, ref: "Course" },
  student: { type: mongoose.Schema.ObjectId, ref: "User" },
  lessonStatus: [
    {
      lesson: { type: mongoose.Schema.ObjectId, ref: "Lesson" },
      complete: Boolean,
    },
  ],
  enrolled: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
  complete: Date,
});

export default mongoose.model("Enrollment", EnrollmentSchema);

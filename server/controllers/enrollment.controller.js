import Enrollment from "../models/enrollment.model";
import errorHandler from "./../helpers/dbErrorHandler";

const create = async (req, res) => {
  let newEnrollment = {
    course: req.course,
    student: req.auth,
  };

  //The lessons array in the course is iterate to generate the lessonStatus array of object for the new enrollment
  newEnrollment.lessonStatus = req.course.lessons.map((lesson) => {
    return { lesson: lesson, complete: false };
  });
  const enrollment = new Enrollment(newEnrollment);

  try {
    const result = await enrollment.save();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

/**
 * If the enrollment did not exist, continue
 * Otherwise, return the exist enrollment
 */
const findEnrollment = async (req, res, next) => {
  try {
    let enrollments = await Enrollment.find({
      course: req.course._id,
      student: req.auth._id,
    });
    console.log("enrollments.length", enrollments.length);
    if (enrollments.length === 0) {
      next();
    } else {
      res.json(enrollments[0]);
    }
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {*} id
 * Load the enrollment detail and append it to req
 */
const enrollmentById = async (req, res, next, id) => {
  try {
    let enrollment = await Enrollment.findById(id)
      .populate({ path: "course", populate: { path: "instructor" } })
      .populate("student", "_id name");

    if (!enrollment) {
      return res.status(400).json({
        error: "Enrollment not found",
      });
    } else {
      req.enrollment = enrollment;
    }
    next();
  } catch (error) {
    return res.status(400).json({
      error: "Could not found the enrollment",
    });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * Check if current user is the student enrolled in the course
 */
const isStudent = (req, res, next) => {
  const isStudent = req.auth && req.auth._id == req.enrollment.student._id;
  if (!isStudent) {
    return res.status(403).json({
      error: "User is not enrolled",
    });
  } else {
    next();
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns the elaborated enrollment details
 */
const read = (req, res) => {
  return res.json(req.enrollment);
};

const listEnrolled = async (req, res) => {
  try {
    //sort: sort the result according ascending order(1);
    let enrollments = await Enrollment.find({ student: req.auth._id })
      .sort({ completed: 1 })
      .populate("course", "_id name category");
    res.json(enrollments);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

export default {
  create,
  findEnrollment,
  enrollmentById,
  read,
  isStudent,
  listEnrolled,
};

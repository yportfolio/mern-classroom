import Course from "../models/course.model";
import extend from "lodash/extend";
import fs from "fs";
import errorHandler from "./../helpers/dbErrorHandler";
import formidable from "formidable";
import defaultImage from "./../../client/assets/images/default.png";

const create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }

    //place req.body data into Course schema
    let course = new Course(fields);
    course.instructor = req.profile;

    if (files.image) {
      course.image.data = fs.readFileSync(files.image.path);
      course.image.contentType = files.image.type;
    }

    try {
      let result = await course.save();
      res.json(result);
    } catch (error) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(error),
      });
    }
  });
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {*} id
 * @returns
 * Load the course by course id and append it to req
 */
const courseById = async (req, res, next, id) => {
  try {
    let course = await Course.findById(id).populate("instructor", "_id name");
    if (!course) {
      return res.status("400").json({ error: "Course not found." });
    } else {
      req.course = course;
    }
    next();
  } catch (error) {
    return res.status("400").json({ error: "Could not retrieve course" });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * Send back all courses that have a instructor id which match the user's id
 */
const listByInstructor = (req, res) => {
  Course.find({ instructor: req.profile._id }, (error, courses) => {
    if (error) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(error),
      });
    } else {
      res.json(courses);
    }
  });
};

const photo = (req, res, next) => {
  if (req.course.image.data) {
    res.set("Content-Type", req.course.image.contentType);
    return res.send(req.course.image.data);
  } else {
    next();
  }
};

const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd() + defaultImage);
};

export default {
  create,
  listByInstructor,
  courseById,
  photo,
  defaultPhoto,
};

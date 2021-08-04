import express from "express";
import enrollmentCtrl from "../controllers/enrollment.controller";
import courseCtrl from "../controllers/course.controller";
import authCtrl from "../controllers/auth.controller";
/**
 * variable courseId add course info to the req,
 * authCtrl.requireSignin add token info to the req.auth property
 */
const router = express.Router();

router
  .route("/api/enrollment/enrolled")
  .get(authCtrl.requireSignin, enrollmentCtrl.listEnrolled);

router
  .route("/api/enrollment/new/:courseId")
  .post(
    authCtrl.requireSignin,
    enrollmentCtrl.findEnrollment,
    enrollmentCtrl.create
  );

router
  .route("/api/enrollment/:enrollmentId")
  .get(authCtrl.requireSignin, enrollmentCtrl.isStudent, enrollmentCtrl.read);

router.param("courseId", courseCtrl.courseById);
router.param("enrollmentId", enrollmentCtrl.enrollmentById);

export default router;

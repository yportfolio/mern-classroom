import express from "express";
import authCtrl from "../controllers/auth.controller";
import courseCtrl from "../controllers/course.controller";
import userCtrl from "../controllers/user.controller";

const router = express.Router();

/**
 * 获取对应user id 注册的所有courses
 */
// router.route("/api/courses/published").get(courseCtrl.listPublished);

router
  .route("/api/courses/by/:userId")
  .post(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    userCtrl.isEducator,
    courseCtrl.create
  )
  .get(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    courseCtrl.listByInstructor
  );

router.param("userId", userCtrl.userByID);

export default router;

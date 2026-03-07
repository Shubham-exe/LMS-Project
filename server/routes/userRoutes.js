import express from "express";
import {
  addUserRating,
  getUserCourseProgress,
  getUserData,
  purchaseCourse,
  updateUserCourseProgress,
  userEnrolledCourses,
} from "../controllers/userController.js";

import { requireAuth } from "@clerk/express";

const userRouter = express.Router();

// User profile
userRouter.get("/data", requireAuth(), getUserData);

// Enrolled courses
userRouter.get("/enrolled-courses", requireAuth(), userEnrolledCourses);

// Purchase course
userRouter.post("/purchase", requireAuth(), purchaseCourse);

// Course progress
userRouter.post("/update-course-progress", requireAuth(), updateUserCourseProgress);
userRouter.post("/get-course-progress", requireAuth(), getUserCourseProgress);

// Rating
userRouter.post("/add-rating", requireAuth(), addUserRating);

export default userRouter;
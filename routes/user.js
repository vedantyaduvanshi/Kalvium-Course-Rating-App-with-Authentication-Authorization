const express = require("express");
const { register,editCourse,login,courses,courseID,addcourse,courseRating,addCourseRating} = require("../controllers/user");
const { authUser } = require("../middleware/auth");
const router = express.Router();



router.post("/register", register);
router.post("/login", login);
router.get("/courses",authUser, courses);
router.get("/courses/:id",authUser, courseID);
router.post("/addcourse",authUser, addcourse);
router.put("/editCourse/:id",authUser, editCourse);
router.get("/courses/:id/rating",authUser, courseRating);
router.post("/addCourseRating/:id/rating",authUser, addCourseRating);

module.exports = router;

const { validateLength } = require("../helpers/validation");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../helpers/token");

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const checkusername = await User.findOne({ username });

    if (!validateLength(username, 4, 22)) {
      return res.status(400).json({
        message: "Username must contain 4-22 characters.",
      });
    } else if (checkusername) {
      return res.status(400).json({
        message: "Username not unique, try another one.",
      });
    } else if (!validateLength(password, 9, 45)) {
      return res.status(400).json({
        message: "Password must be atleast 9 characters",
      });
    } else {
      const cryptedPassword = await bcrypt.hash(password, 12);
      const user = await new User({
        username,
        password: cryptedPassword,
      }).save();
      const token = generateToken({ id: user._id.toString() }, "5d");
      res.send({
        token: token,
        createdAt: user.createdAt,
        username: user.username,
        message:
          "Done! Success : Always use the auth token whensending requests",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "username not registered." });
    }
    const checkPasswordCorrectorNot = await bcrypt.compare(
      password,
      user.password
    );
    if (!checkPasswordCorrectorNot) {
      return res
        .status(400)
        .json({ message: "Incorrect username or password." });
    }
    const token = generateToken({ id: user._id.toString() }, "7d");
    res.send({
      createdAt: user.createdAt,
      username: user.username,
      token: token,
      message:
        "Login Success : Always use the auth token when sending requests",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

let courses = [
  { id: "1234", name: "Node Js", description: "Node Js Course" },
  {
    id: "5678",
    name: "FOSS",
    description: "Free and Open Source Software Course",
  },
];

let ratings = {};

exports.courses = async (req, res) => {
  try {
    res.send({
      courses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.courseID = async (req, res) => {
  try {
    const course = courses.find((c) => c.id === req.params.id);
    if (!course) return res.status(404).send("Course not found");
    res.send({
      course,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addcourse = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    if (user.admin === true) {
      const course = req.body;
      courses.push(course);
      res.send({
        message: "Succesfully added",
      });
    } else {
      res.send({
        message: "You are not Admin ,u cant .",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.courseRating = async (req, res) => {
  try {
    const courseId = req.params.id;
    const courseRatings = ratings[courseId];
    if (!courseRatings || courseRatings.length === 0) {
      return res.status(404).send({
        message: "No ratings found for this course",
      });
    }

    const averageRating =
      courseRatings.reduce((a, b) => a + b, 0) / courseRatings.length;
    return res.send({
      averageRating,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addCourseRating = async (req, res) => {
  try {
    const courseId = req.params.id;
    console.log(req.body);
    const rating = req.body.rating;

    if (!ratings[courseId]) {
      ratings[courseId] = [];
    }

    ratings[courseId].push(rating);
    res.status(201).send("Rating added successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.editCourse = async (req, res) => {
  try {
    const course = courses.find((c) => c.id === req.params.id);
    if (!course) return res.status(404).send("Course not found");
    const id = req.user.id;
    const user = await User.findById(id);
    if (user.admin === true) {
        course.name = req.body.name;
        course.description = req.body.description;
        res.send({
            message: "Successfully Modified",
          });   
    } else {
      res.send({
        message: "You are not Admin ,u cant .",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

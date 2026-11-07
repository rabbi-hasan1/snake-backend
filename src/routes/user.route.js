import { Router } from "express";
import { getUserProfile, loginUser, logoutUser, refreshToken, registerUser } from "../controllers/user.controller.js";
import { body } from "express-validator";
import { upload } from './../middlewares/multer.middleware.js';
import { checkAuth } from "../middlewares/auth.middleware.js";

const userValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("username is must be required")
    .isLength({ min: 3, max: 125 })
    .withMessage("username must be 3-125 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is must be required")
    .isEmail()
    .withMessage("please provide a valid email adress"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .isLength({max:120}).withMessage("the max length of password is 120")
];

const loginValidation = [
    body("email")
    .trim()
    .notEmpty()
    .withMessage("email is must be required")
    .isEmail()
    .withMessage("please provide a valid email adress"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .isLength({max:120}).withMessage("the max length of password is 120")
]

const userRouter = Router();
userRouter.post("/register", upload.single("profilePhoto") ,userValidation, registerUser);
userRouter.post("/login", loginValidation, loginUser );
userRouter.get("/logout", checkAuth, logoutUser);
userRouter.get("/refreshToken", checkAuth, refreshToken);
userRouter.get("/me", checkAuth, getUserProfile);
export default userRouter;

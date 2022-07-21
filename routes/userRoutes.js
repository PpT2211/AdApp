import { createRequire } from 'module'
import userModel from "../models/user.js"
import errors from "../errorHandlers/error.js"
import wrapAsync from '../errorHandlers/asyncError.js'
import validSchemas from "../validationSchemas.js"
import passport from 'passport'
import authController from '../controllers/authController.js'

const require = createRequire(import.meta.url)

const express = require('express')

const User = userModel.User
const userRouter = express.Router()

var destinationUrl;

// register new user

userRouter.route("/register")
    .get(authController.renderRegistrationFrom)
    .post(wrapAsync(authController.registerNewUser))

// login user

userRouter.route("/login")
    .get(authController.renderLoginForm)
    .post(passport.authenticate('local',{ failureFlash: true, failureRedirect: '/login' }), authController.loginUser)

// logout user

userRouter.get('/logout', authController.logoutUser)

export default userRouter
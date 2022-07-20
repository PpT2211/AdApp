import { createRequire } from 'module'
import userModel from "../models/user.js"
import errors from "../errorHandlers/error.js"
import wrapAsync from '../errorHandlers/asyncError.js'
import validSchemas from "../validationSchemas.js"
import passport from 'passport'
const require = createRequire(import.meta.url)

const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')

const User = userModel.User
const AppError = errors.AppError
const adSchema = validSchemas.adSchema
const sessionOptions = {secret:'heylo', resave:false, saveUninitialized:false}
const userRouter = express.Router()


userRouter.use(session(sessionOptions))

const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login')
    }
    next();
}

userRouter.get("/register", (req,res)=>{
    res.render("auth/register")
})

userRouter.post("/register", wrapAsync(async (req,res)=>{
    try {
        const {username, email, age , password} = req.body
        const user = new User({ email, age, username })
        const newUser = await User.register(user, password)
        req.session.user_id = newUser._id
        req.flash('success','Welcome to AdApp!')
        res.redirect("/ad/allAds")
    } catch (e) {
        req.flash('error',e.message)
        res.redirect("/register")
    }
}))


userRouter.get("/login", (req,res)=>{
    res.render("auth/login")
})

userRouter.post("/login", passport.authenticate('local',{ failureFlash: true, failureRedirect: '/login' }),wrapAsync(async (req,res)=>{
    const { username, password } = req.body;
    // const foundUser = await User.findAndValidate(username, password);
    // if (foundUser) {
    //     req.session.user_id = foundUser._id;
    req.flash('success',`Welcome back ${username}!`)
    res.redirect("/ad/allAds")
    // }
}))

userRouter.get('/logout', (req, res) => {
    req.flash('success','Successfully logged out!')
    res.redirect("/ad/allAds");
    req.session.user_id = null;
    req.session.destroy();
})

export default userRouter
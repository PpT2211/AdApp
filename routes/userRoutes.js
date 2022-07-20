import { createRequire } from 'module'
import userModel from "../models/user.js"
import errors from "../errorHandlers/error.js"
import wrapAsync from '../errorHandlers/asyncError.js'
import validSchemas from "../validationSchemas.js"
import passport from 'passport'
const require = createRequire(import.meta.url)

const express = require('express')

const User = userModel.User
const userRouter = express.Router()

var destinationUrl;


userRouter.get("/register", (req,res)=>{
    res.render("auth/register")
})

userRouter.post("/register", wrapAsync(async (req,res, next)=>{
    try {
        const {username, email, age , password} = req.body
        const user = new User({ email, age, username })
        const newUser = await User.register(user, password)
        req.login(newUser, err => {
            if(err) return next(err)
            req.flash('success','Welcome to AdApp!')
            res.redirect("/ad/allAds")
        })
    } catch (e) {
        req.flash('error',e.message)
        res.redirect("/register")
    }
}))


userRouter.get("/login", (req,res)=>{
    res.render("auth/login")
    destinationUrl = req.session.destination || "/ad/allAds"
})

userRouter.post("/login", passport.authenticate('local',{ failureFlash: true, failureRedirect: '/login' }),(req,res)=>{
    res.redirect(destinationUrl)
})

userRouter.get('/logout', (req, res) => {
    req.logout(function(err){
        if(err){ 
            return next(err)
        }
        req.flash('success','Successfully logged out!')
        res.redirect("/ad/allAds");
    })
})

export default userRouter
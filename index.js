import { createRequire } from 'module'
import { fileURLToPath } from "url"
import cities from "./seeds/cities.js"
import models from "./models/advertisement.js"
import reviewModel from "./models/review.js"
import userModel from "./models/user.js"
import errors from "./errorHandlers/error.js"
import wrapAsync from "./errorHandlers/asyncError.js"
import validSchemas from "./validationSchemas.js"
import adRouter from "./routes/adRoutes.js"
import userRouter from "./routes/userRoutes.js"
import reviewRouter from "./routes/reviewRoutes.js"
const require = createRequire(import.meta.url)

const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')
const ejsMate = require('ejs-mate')
const flash = require('connect-flash')
const session = require('express-session')
const Ad = models.Ad
const Review = reviewModel.Review
const User = userModel.User
const AppError = errors.AppError
const adSchema = validSchemas.adSchema
const reviewSchema = validSchemas.reviewSchema
const passport = require('passport')
const LocalStrategy = require('passport-local')

const app = express()
const port = 3000
const path = require("path")
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const sessionConfig = {
    secret:'heylo', 
    resave:false, 
    saveUninitialized:true,
    cookies: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

mongoose.connect('mongodb://127.0.0.1:27017/AdApp')
    .then(() => {
        console.log("DB connected")
    })
    .catch((err) => {
        console.log(err)
    })

app.engine('ejs', ejsMate)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.use(express.static(path.join(__dirname, '/public')))
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use((req, res, next) => {
    console.log("Heylo :)")
    next()
})
app.use(flash())
app.use(session(sessionConfig))
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})



app.use("/",userRouter)
app.use("/ad",adRouter)
app.use("/review",reviewRouter)


app.get("/", wrapAsync(async (req, res, next) => {
    res.redirect("/ad/allAds")
}))

app.all('*', (req, res, next) => {
    next(new AppError(404, "Page not found :("))
})

app.use((err, req, res, next) => {
    const { status = 500, message = "something went wrong" } = err;
    res.status(status).render("error", { err })
})

app.listen(port, () => {
    console.log(`You're on port ${port}`)
})

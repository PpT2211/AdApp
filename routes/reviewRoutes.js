import { createRequire } from 'module'
import models from "../models/advertisement.js"
import reviewModel from "../models/review.js"
import errors from "../errorHandlers/error.js"
import wrapAsync from "../errorHandlers/asyncError.js"
import validSchemas from "../validationSchemas.js"
import middleware from "../middleware.js"

const require = createRequire(import.meta.url)

const express = require('express')
const Ad = models.Ad
const Review = reviewModel.Review
const AppError = errors.AppError
const isLoggedin = middleware.isLoggedin
const reviewSchema = validSchemas.reviewSchema
const flash = require('connect-flash')

const reviewRouter = express.Router()

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const message = error.details.map(el => el.message).join(', ')
        throw new AppError(400, message)
    } else {
        next()
    }
}

// show reviews

reviewRouter.post('/show/:id/reviews', isLoggedin, validateReview, wrapAsync(async (req, res, next) => {
    const id = req.params.id
    const data = await Ad.findById(id)
    const review = await Review(req.body.review)
    data.reviews.push(review)
    await review.save()
    await data.save()
    req.flash('success','Successfully added a review!')
    res.redirect(`/ad/show/${id}`)
}))

// delete review

reviewRouter.delete('/show/:id/reviews/:reviewId', wrapAsync(async(req,res,next)=>{
    const { id, reviewId } = req.params
    await Ad.findByIdAndUpdate(id, {$pull: { reviews: reviewId }})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success','Successfully deleted a review!')
    res.redirect(`/ad/show/${id}`)
}))

export default reviewRouter
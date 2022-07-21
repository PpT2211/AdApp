import { createRequire } from 'module'
import models from "../models/advertisement.js"
import reviewModel from "../models/review.js"
import errors from "../errorHandlers/error.js"
import wrapAsync from "../errorHandlers/asyncError.js"
import schemas from "../validationSchemas.js"
import middleware from "../middleware.js"
import reviewController from '../controllers/reviewController.js'

const require = createRequire(import.meta.url)

const express = require('express')
const Ad = models.Ad
const Review = reviewModel.Review
const AppError = errors.AppError
const isLoggedin = middleware.isLoggedin
const reviewSchema = schemas.reviewSchema
const flash = require('connect-flash')
const validateReview = middleware.validateReview
const isReviewAuthor = middleware.isReviewAuthor

const reviewRouter = express.Router()


// show reviews

reviewRouter.post('/show/:id/reviews', isLoggedin, validateReview, wrapAsync(reviewController.postReview))

// delete review

reviewRouter.delete('/show/:id/reviews/:reviewId', isReviewAuthor, wrapAsync(reviewController.deleteReview))

export default reviewRouter
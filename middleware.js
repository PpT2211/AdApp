import models from './models/advertisement.js'
import reviewModel from './models/review.js'
import schemas from './validationSchemas.js'
import errors from './errorHandlers/error.js'


const Ad = models.Ad
const Review = reviewModel.Review
const adSchema = schemas.adSchema
const AppError = errors.AppError
const reviewSchema = schemas.reviewSchema

const isLoggedin = (req,res,next) => {
    var url = req.originalUrl
    if(!url.includes('reviews')){
        req.session.destination = req.originalUrl
    }else{
        url = url.replace('/reviews','')
        req.session.destination = `ad/${url.replace('/review','')}`
    }
    if(!req.isAuthenticated()){
        req.flash('error','You need to be signed in')
        return res.redirect('/login')
    }
    next()
}
const validateAd = (req, res, next) => {
    const { error } = adSchema.validate(req.body)
    if (error) {
        const message = error.details.map(el => el.message).join(', ')
        throw new AppError(400, message)
    } else {
        next()
    }
}
const isAuthor = async(req,res,next) => {
    const {id} = req.params;
    const data = await Ad.findById(id)
    if(!data.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that. Naughty naughty.')
        return res.redirect(`/ad/show/${id}`)
    }
    next()
}
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const message = error.details.map(el => el.message).join(', ')
        throw new AppError(400, message)
    } else {
        next()
    }
}
const isReviewAuthor = async(req,res,next) => {
    const { id,reviewId } = req.params;
    const review = await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that. Naughty naughty.')
        return res.redirect(`/ad/show/${id}`)
    }
    next()
}

const middleware = {
    isLoggedin: isLoggedin,
    validateAd: validateAd,
    isAuthor: isAuthor,
    validateReview: validateReview,
    isReviewAuthor: isReviewAuthor
}

export default middleware

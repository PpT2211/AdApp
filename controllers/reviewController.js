import models from '../models/advertisement.js'
import reviewModel from '../models/review.js'

const Ad = models.Ad
const Review = reviewModel.Review

const postReview = async (req, res, next) => {
    const id = req.params.id
    const data = await Ad.findById(id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    data.reviews.push(review)
    await review.save()
    await data.save()
    req.flash('success','Successfully added a review!')
    res.redirect(`/ad/show/${id}`)
}
const deleteReview = async(req,res,next)=>{
    const { id, reviewId } = req.params
    await Ad.findByIdAndUpdate(id, {$pull: { reviews: reviewId }})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success','Successfully deleted a review!')
    res.redirect(`/ad/show/${id}`)
}

const reviewController = {
    postReview,
    deleteReview
}

export default reviewController
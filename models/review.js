import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const reviewSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    }
})

const Review = mongoose.model('Reviews', reviewSchema)

const reviewModel = {
    Review: Review
}

export default reviewModel
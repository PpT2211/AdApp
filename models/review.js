import { createRequire } from 'module'
import userModel from './user.js'

const require = createRequire(import.meta.url)

const mongoose = require('mongoose')
const User = userModel.User
const Schema = mongoose.Schema

const reviewSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: User
    }
})

const Review = mongoose.model('Reviews', reviewSchema)

const reviewModel = {
    Review
}

export default reviewModel
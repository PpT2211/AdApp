import { createRequire } from 'module'
import reviewModel from './review.js'
import userModel from './user.js'

const require = createRequire(import.meta.url)

const mongoose = require('mongoose')
const Review = reviewModel.Review
const User = userModel.User
const Schema = mongoose.Schema

const adSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Your parents gave you a name. You give your product a name']
    },
    image: {
        type: String,
        required: [true, "How does your product look?"]
    },
    description: {
        type: String,
        required: [true, 'Who is your product?']
    },
    location: {
        type: String,
        required: [true, "Where do you live? Just city is enough. Don't be shy to tell."]
    },
    link: {
        type: String,
        required: [true, 'Where should we go to get your amazing product?']
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: User
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: Review
        }
    ]
})

adSchema.post('findOneAndDelete',async function (doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }
})

const Ad = mongoose.model('Ad', adSchema)

const models = {
    Ad: Ad
}



export default models
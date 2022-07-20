import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const passportLocalMongoose = require('passport-local-mongoose')


const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    }
})

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model('Users', userSchema)

const userModel = {
    User: User
}

export default userModel
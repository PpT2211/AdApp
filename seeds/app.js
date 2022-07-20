import { createRequire } from 'module'
import models from "../models/advertisement.js"
const require = createRequire(import.meta.url)
const cities = require('./cities')


mongoose.connect('mongodb://127.0.0.1:27017/AdApp')
    .then(() => {
        console.log("DB connected")
    })
    .catch((err) => {
        console.log(err)
    })

const seedDB = () => {
    console.log(`${cities[1].city} - ${cities[1].lat} ${cities[1].lng}`)
}

seedDB()
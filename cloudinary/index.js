import { createRequire } from 'module'

const require = createRequire(import.meta.url)
if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: 'AdApp',
        allowed_formats: ['jpeg','png','jpg']
    }
})

const cloudExport = {
    cloudinary,
    storage
}

export default cloudExport
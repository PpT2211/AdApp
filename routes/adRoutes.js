import { createRequire } from 'module'
import models from "../models/advertisement.js"
import errors from "../errorHandlers/error.js"
import wrapAsync from '../errorHandlers/asyncError.js'
import validSchemas from "../validationSchemas.js"
import middleware from "../middleware.js"
import adController from '../controllers/adController.js'
import cloudExport  from '../cloudinary/index.js'

const require = createRequire(import.meta.url)

const express = require('express')
const flash = require('connect-flash')
const multer = require('multer')

const Ad = models.Ad
const AppError = errors.AppError
const adSchema = validSchemas.adSchema
const isLoggedin = middleware.isLoggedin
const validateAd = middleware.validateAd
const isAuthor = middleware.isAuthor
const adRouter = express.Router()
const storage = cloudExport.storage
const upload = multer({ storage })


// home page basically. All Ads

adRouter.get('/allAds', wrapAsync(adController.index))

// add new Ad

adRouter.route('/addAd')
    .get(isLoggedin, wrapAsync(adController.renderNewForm))
    .post(isLoggedin, upload.array('adPics'), validateAd, wrapAsync(adController.createAd))
    
// show a specific Ad

adRouter.get('/show/:id', wrapAsync(adController.viewAd))

// edit/update a specific Ad

adRouter.route('/edit/:id')
    .get(isLoggedin, isAuthor, wrapAsync(adController.renderEditForm))
    .put(isLoggedin, isAuthor, upload.array('adNewPics'), validateAd, wrapAsync(adController.editAd))

// delete Ad

adRouter.delete('/delete/:id', isLoggedin, isAuthor, wrapAsync(adController.deleteAd))

export default adRouter
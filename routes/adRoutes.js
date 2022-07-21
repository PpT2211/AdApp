import { createRequire } from 'module'
import models from "../models/advertisement.js"
import errors from "../errorHandlers/error.js"
import wrapAsync from '../errorHandlers/asyncError.js'
import validSchemas from "../validationSchemas.js"
import middleware from "../middleware.js"
const require = createRequire(import.meta.url)

const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')

const Ad = models.Ad
const AppError = errors.AppError
const adSchema = validSchemas.adSchema
const isLoggedin = middleware.isLoggedin
const validateAd = middleware.validateAd
const isAuthor = middleware.isAuthor
const adRouter = express.Router()


// home page basically. All Ads

adRouter.get('/allAds', wrapAsync(async (req, res, next) => {
    const data = await Ad.find({})
    if (data) {
        res.render('home', { ad: data })
    } else {
        throw new AppError(404, "Data requested doesn't exist")
    }
}))

// add new Ad

adRouter.get('/addAd', isLoggedin, wrapAsync(async (req, res, next) => {
    res.render('new')
}))

adRouter.post('/addAd', isLoggedin, validateAd, wrapAsync(async (req, res, next) => {
    const {title,image,description,location,link } = req.body
    const data = new Ad({title,image,description,location,link, author:res.locals.currentUser._id})
    await data.save()
    req.flash('success', 'Successfully made an Ad!')
    res.redirect('/ad/allAds')
}))

// show a specific Ad

adRouter.get('/show/:id', wrapAsync(async (req, res, next) => {
    const data = await Ad.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if (!data) {
        req.flash('error','Cannot find the Ad you requested for')
        return res.redirect('/ad/allAds')
    }
    res.render('ads/show', { a: data })

}))

// edit/update a specific Ad

adRouter.get('/edit/:id', isLoggedin, isAuthor, wrapAsync(async (req, res, next) => {
    const data = await Ad.findById(req.params.id)
    if (!data) {
        throw new AppError(404, "Data requested doesn't exist")
    }
    res.render('ads/edit', { a: data })
}))

adRouter.put('/edit/:id', isLoggedin, isAuthor, validateAd, wrapAsync(async (req, res, next) => {
    const updatedData = req.body
    const data = await Ad.findByIdAndUpdate(req.params.id, updatedData, { runValidators: true, new: true })
    req.flash('success','Successfully updated an Ad!')
    res.redirect(`/ad/show/${req.params.id}`)

}))

// delete Ad

adRouter.delete('/delete/:id', isLoggedin, isAuthor, wrapAsync(async (req, res, next) => {

    const data = await Ad.findByIdAndDelete(req.params.id)
    if (!data) {
        throw new AppError(404, "Data requested doesn't exist")
    }
    req.flash('success','Successfully deleted an Ad!')
    res.redirect('/ad/allAds')

}))

export default adRouter
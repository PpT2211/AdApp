import { createRequire } from 'module'
import models from "../models/advertisement.js"
import errors from "../errorHandlers/error.js"
import wrapAsync from '../errorHandlers/asyncError.js'
import validSchemas from "../validationSchemas.js"
const require = createRequire(import.meta.url)

const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')

const Ad = models.Ad
const AppError = errors.AppError
const adSchema = validSchemas.adSchema
// const sessionOptions = {secret:'heylo', resave:false, saveUninitialized:false} 
const adRouter = express.Router()

const validateAd = (req, res, next) => {
    const { error } = adSchema.validate(req.body)
    if (error) {
        const message = error.details.map(el => el.message).join(', ')
        throw new AppError(400, message)
    } else {
        next()
    }
}

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

adRouter.get('/addAd', wrapAsync(async (req, res, next) => {
    if(!req.isAuthenticated()){
        req.flash('error','You need to be signed in')
        res.redirect('/login')
    }else{
        res.render('new')
    }
}))

adRouter.post('/addAd', validateAd, wrapAsync(async (req, res, next) => {
    const data = new Ad(req.body)
    await data.save()
    req.flash('success', 'Successfully made an Ad!')
    res.redirect('/ad/allAds')
}))

// show a specific Ad

adRouter.get('/show/:id', wrapAsync(async (req, res, next) => {
    const data = await Ad.findById(req.params.id).populate('reviews')
    if (!data) {
        req.flash('error','Cannot find the Ad you requested for')
        return res.redirect('/')
    }
    res.render('ads/show', { a: data })

}))

// edit/update a specific Ad

adRouter.get('/edit/:id', wrapAsync(async (req, res, next) => {
    const data = await Ad.findById(req.params.id)
    if (!data) {
        throw new AppError(404, "Data requested doesn't exist")
    }
    res.render('ads/edit', { a: data })
}))

adRouter.put('/edit/:id', validateAd, wrapAsync(async (req, res, next) => {
    const updatedData = req.body
    const data = await Ad.findByIdAndUpdate(req.params.id, updatedData, { runValidators: true, new: true })
    req.flash('success','Successfully updated an Ad!')
    res.redirect(`/ad/show/${req.params.id}`)

}))

// delete Ad

adRouter.delete('/delete/:id', wrapAsync(async (req, res, next) => {

    const data = await Ad.findByIdAndDelete(req.params.id)
    if (!data) {
        throw new AppError(404, "Data requested doesn't exist")
    }
    req.flash('success','Successfully deleted an Ad!')
    res.redirect('/ad/allAds')

}))

export default adRouter
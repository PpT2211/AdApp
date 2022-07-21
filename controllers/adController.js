import models from '../models/advertisement.js'
import errors from '../errorHandlers/error.js'

const Ad = models.Ad
const AppError = errors.AppError

const index = async (req, res, next) => {
    const data = await Ad.find({})
    if (data) {
        res.render('home', { ad: data })
    } else {
        throw new AppError(404, "Data requested doesn't exist")
    }
}
const renderNewForm = async (req, res, next) => {
    res.render('new')
}
const createAd = async (req, res, next) => {
    const {title,image,description,location,link } = req.body
    const data = new Ad({title,image,description,location,link, author:res.locals.currentUser._id})
    await data.save()
    req.flash('success', 'Successfully made an Ad!')
    res.redirect('/ad/allAds')
}
const viewAd = async (req, res, next) => {
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
}
const renderEditForm = async (req, res, next) => {
    const data = await Ad.findById(req.params.id)
    if (!data) {
        throw new AppError(404, "Data requested doesn't exist")
    }
    res.render('ads/edit', { a: data })
}
const editAd = async (req, res, next) => {
    const updatedData = req.body
    const data = await Ad.findByIdAndUpdate(req.params.id, updatedData, { runValidators: true, new: true })
    req.flash('success','Successfully updated an Ad!')
    res.redirect(`/ad/show/${req.params.id}`)
}
const deleteAd = async (req, res, next) => {

    const data = await Ad.findByIdAndDelete(req.params.id)
    if (!data) {
        throw new AppError(404, "Data requested doesn't exist")
    }
    req.flash('success','Successfully deleted an Ad!')
    res.redirect('/ad/allAds')

}


const adController = {
    index,
    renderNewForm,
    createAd,
    viewAd,
    renderEditForm,
    editAd,
    deleteAd
}
export default adController
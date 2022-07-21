import Joi from 'joi'


const adSchema = Joi.object({
    title: Joi.string().required(),
    // image: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    link: Joi.string().required(),
    deleteImages: Joi.array()
})
const reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required()
    }).required()
})

const schemas = {
    adSchema,
    reviewSchema
}
export default schemas
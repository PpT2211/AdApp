import Joi from 'joi'


const adSchema = Joi.object({
    title: Joi.string().required(),
    image: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    link: Joi.string().required()
})
const reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required()
    }).required()
})

const schemas = {
    adSchema: adSchema,
    reviewSchema: reviewSchema
}
export default schemas
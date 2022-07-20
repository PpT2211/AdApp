const isLoggedin = (req,res,next) => {
    var url = req.originalUrl
    if(!url.includes('reviews')){
        req.session.destination = req.originalUrl
    }else{
        url = url.replace('/reviews','')
        req.session.destination = `ad/${url.replace('/review','')}`
    }
    if(!req.isAuthenticated()){
        req.flash('error','You need to be signed in')
        return res.redirect('/login')
    }
    next()
}

const middleware = {
    isLoggedin: isLoggedin
}

export default middleware

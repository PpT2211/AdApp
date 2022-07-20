const isLoggedin = (req,res,next) => {
    req.session.destination = req.originalUrl
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
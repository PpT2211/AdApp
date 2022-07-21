import userModel from '../models/user.js'

const User = userModel.User
var destinationUrl

const renderRegistrationFrom = (req,res)=>{
    res.render("auth/register")
}
const registerNewUser = async (req,res, next)=>{
    try {
        const {username, email, age , password} = req.body
        const user = new User({ email, age, username })
        const newUser = await User.register(user, password)
        req.login(newUser, err => {
            if(err) return next(err)
            req.flash('success','Welcome to AdApp!')
            res.redirect("/ad/allAds")
        })
    } catch (e) {
        req.flash('error',e.message)
        res.redirect("/register")
    }
}
const renderLoginForm = (req,res)=>{
    res.render("auth/login")
    destinationUrl = req.session.destination || '/ad/allAds'
}
const loginUser = (req,res)=>{
    res.redirect(destinationUrl)
}
const logoutUser = (req, res) => {
    req.logout(function(err){
        if(err){ 
            return next(err)
        }
        req.flash('success','Successfully logged out!')
        res.redirect("/ad/allAds");
    })
}

const authController = {
    renderRegistrationFrom,
    registerNewUser,
    renderLoginForm,
    loginUser,
    logoutUser
}

export default authController
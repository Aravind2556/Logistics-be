const UserModel = require('../models/User')

const isAuth = async (req, res, next) => {
    try{
        if(req.session.user){
            next()
        }
<<<<<<< HEAD

        const fetchUser = await UserModel.findOne({email: req.session.user.email.toLowerCase()})
        if(!fetchUser){
            return res.send({success: false, message: 'User not found!'})
        }

        next()
=======
        return res.send({success: false, message: 'Please login to access this page!'})
>>>>>>> 54e1cd1fdfab8c79faa30a60366f79a6bccae232
    }
    catch(err){
        console.log("Error in isAuth:",err)
        return res.send({success: false, message: 'Trouble in checking Authentication! Please contact support Team.'})
    }
}

module.exports = isAuth;

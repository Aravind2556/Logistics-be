const isAuth = (req, res, next) => {
    try{
        if(!req.session.user){
            return res.send({success: false, message: 'Please login to access this page!'})
        }
        next()
    }
    catch(err){
        console.log("Error in isAuth:",err)
        return res.send({success: false, message: 'Trouble in checking Authentication! Please contact support Team.'})
    }
}
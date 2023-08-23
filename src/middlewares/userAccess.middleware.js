function userAccess(req,res,next){
    if(req.session.user.role === 'user'){
        next()
    }else{
        res.status(403).json({error:'Forbiden'})
    }
}

module.exports = userAccess
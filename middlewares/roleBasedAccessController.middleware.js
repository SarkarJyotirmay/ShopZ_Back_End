const authorizer = (roles)=> (req, res, next)=>{
    const hasAccess = roles.includes(req.userData.role)
    if (!hasAccess){
       return res
       .status(403)
       .json({
            success: false,
            message: "Only SELLER or ADMIN can create a cupon"
        })
    }
    next()
}

module.exports = authorizer
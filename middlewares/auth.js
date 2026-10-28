const jwt = require("jsonwebtoken");

exports.generateToken = async(userId,userRole) =>{

    if(!userId || !userRole){
        return undefined;
    }

    const options = {
        userId,
        userRole
    }

    const token = await jwt.sign(options,process.env.JWT_SECRET_KEY,{expiresIn:"7d"});

    if(!token){
        return undefined;
    }

    console.log("token----->",token);

    return token;

    
    

}

exports.verifyToken = async(req,res,next) =>{

    try {
        
        const {token} = req.cookies;

        console.log("token----->",token);

        if(!token){
            return res.status(401).json({
                success:false,
                message:"token not found"
            })
        }

        const {userId,userRole} = await jwt.verify(token,process.env.JWT_SECRET_KEY)
        

        req.userId = userId;
        req.userRole = userRole;
        next()
        

    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
            
          });
    }

}

exports.AutherizeUser = (requiredRoles) =>{
    
    return(req,res,next) =>{
        
        if(!requiredRoles?.includes(req.userRole)){
            return res.status(403).json({
                success:false,
                message:"access denied"
            });


        }

        next()

    }

}


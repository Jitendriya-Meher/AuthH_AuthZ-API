
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = (req,res,next) => {

    try{
        // extract JWT token
        // 3 ways -> req body, req cookie, header

        // console.log("cookie: " + req.cookies.token);
        // console.log("Header: " + req.header("Authorization").replace("Bearer ", ""));
         
        const token = req.body.token || req.cookies.token ||  req.header("Authorization").replace("Bearer ", "");

        if( !token){
            return res.status(401).json({
                success: false,
                message:"Token Missing"
            });
        }

        // verify the token
        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET);

            console.log(decode);

            req.user = decode;
        }
        catch(err){
            return res.status(401).json({
                success: false,
                message:"Token is invalid"
            });
        }

        next();

    }
    catch(err){
        return res.status(401).json({
            success: false,
            message:"Something went wrong while verifying the token"
        });
    }
}

exports.isStudent = (req, res,next) => {

    try{
        if( req.user.role !== "Student"){
            return res.status(401).json({
                success: false,
                message:"This is a protected route for student"
            });
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message:"User role cannot be verified or matching"
        });
    }
}

exports.isAdmin = (req, res, next) => {

    try{
        if( req.user.role !== "Admin"){
            return res.status(401).json({
                success: false,
                message:"This is a protected route for Admin"
            });
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message:"User role cannot be verified or matching"
        });
    }

}
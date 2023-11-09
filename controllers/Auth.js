
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require("jsonwebtoken");
require('dotenv').config();

// signup route handler
exports.signup = async(req,res) => {

    try{
        // get data 
        const {name , email, password, role} = req.body;

        // check if user is already exit
        const existingUser = await User.findOne({ email});

        if( existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            });
        }

        // secure password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash( password, 10); 
        }
        catch(e){
            return res.status(500).json({
                success:false,
                message:"Error in hashing Password"
            });
        }

        // create entry for user
        const user = await User.create({
            name,email,password:hashedPassword,role
        });

        return res.status(200).json({
            success:true,
            message:"user created successfully",
            user:user,
        });

    }
    catch(err){
        console.log(err);
        return res.status(400).json({
            success:false,
            message:"Error in SignUp, user cannot register Please try again later"
        });
    }
}

// login route handlers
exports.login = async(req, res) => {

    try{
        // fetch data
        const {email, password} = req.body;

        // validate on email and password
        if( !email || !password ){
            return res.status(400).json({
                success:false,
                message:"Pleae fill all the details carefully"
            });
        }

        //check for register user
        let user = await User.findOne({email});
        
        // if not registration
        if( !user ){
            return res.status(400).json({
                success:false,
                message:"User is not Register"
            });
        }

        // verify password and generate a (JWT) token

        const payload = {
            email: user.email,
            id:user._id,
            role:user.role
        };

        const check = await bcrypt.compare(password, user.password);

        if( check ){

            // password matches
            let token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                {
                    expiresIn: "2h"
                }
            );

            user = user.toObject();
            user.token = token;
            user.password = undefined;
            console.log("user = ", user);

            const options = {
                expires:new Date( Date.now() + 3*24*60*60*1000 ),
                httpOnly : true
            }

            res.cookie(
                "token",
                token,
                options
            ).status(200).json(
                {
                    success: true,
                    message: "User Login SuccessFully",
                    user:user,
                    token:token
                }
            );

        }
        else{
            return res.status(400).json({
                success:false,
                message:"Incorrect Password"
            });
        }

    }
    catch(err){
        return res.status(200).json({
            success:false,
            message:"Login Failed",
        });
    }

};

const express = require('express');
const router = express.Router();

const { signup,login} = require("../controllers/Auth");

// router.post("/login", login);
router.post("/signup", signup);
router.post("/login", login);

const {auth, isStudent, isAdmin} = require("../middlewares/auth");

// test route 
router.get("/test",auth, (req, res) => {
    res.json({
        message :"Welcome to test private Page",
        success:true
    });
});

// protected routes
router.get("/student", auth, isStudent, (req,res) => {

    res.json({
        success: true,
        message:"Welcome to the Student private Page"
    });

} );

router.get("/admin", auth, isAdmin, (req,res) => {

    res.json({
        success: true,
        message:"Welcome to the Admin private Page"
    });
    
} );

router.get("/getEmail",auth, (req,res) => {
    const id = req.user.id;
    console.log("id",id);
})

module.exports = router;
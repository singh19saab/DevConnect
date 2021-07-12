const express = require('express')
const router = express.Router();
const {check , validationResult} = require('express-validator')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')

const User = require('../../model/User')

// @route    GET api/users
// @Desc     Test route 
//@access    Public
router.post('/', [
    check("name" , "Name is required").not().isEmpty() ,
    check("email" , "Enter a valid Email").isEmail() ,
    check("password" , "Enter min of 6 Characters for password").isLength({min:6})
], async(req, res) => {
    console.log(req.body)
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {name, email , password} = req.body;

    try {
        //See if User exists
        let user = await User.findOne({email});

        if(user){
            return res.status(400).json({errors : [{message : "User already exists"}]})
        }
    
        //Get user gravatar
        const avatar = gravatar.url(email , {
            s: 200,
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name,
            email,
            password,
            avatar
        });

    
        //encrypt password
        const salt= await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password , salt);

        await user.save();
    
        //return jwt
        const payLoad = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payLoad, config.get('jwtSecret') , {expiresIn : 360000} , (err , token) => {
            if(err) throw err;
            res.json({token})
        })
        
    } catch (error) {
        console.log(error.message)
        res.status(500).send("Server Error")
    }

})

module.exports = router;
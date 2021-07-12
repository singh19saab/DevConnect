const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')

const auth = require('../../middleware/auth')

const User = require('../../model/User')


// @route    GET api/auth
// @Desc     Test route 
//@access    Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).send("Server Error")
    }
})

// @route    POST api/auth
// @Desc     Authenticated and verify 
//@access    Public
router.post('/', [
    check("email", "Enter a valid Email").isEmail(),
    check("password", "Password is required").exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const { email, password } = req.body;

    try {

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ errors: [{ message: "Invalid Credentials" }] })
        }

        const isMatch = await bcrypt.compare(password , user.password);

        if(!isMatch) {
            return res.status(400).json({ errors: [{ message: "Invalid Credentials" }] })
        }

        //return jwt
        const payLoad = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payLoad, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({ token })
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).send("Server Error")
    }

})

module.exports = router;
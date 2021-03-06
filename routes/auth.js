const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/User');
const verify = require('./verifyToken');
const jwt_decode = require('jwt-decode');
const ObjectId = require('mongodb').ObjectID;

const {registerValidation,loginValidation} = require('../validation/userValidation');

// Register
router.post('/register', async (req, res) => {
    
    //validate the request
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    // check if the user is already in the db
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already taken.');
    
    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        user_role: req.body.user_role
    });
    try {
        const savedUser = await user.save();
        res.send({user: user._id});
    }
    catch(err) { 
        res.status(400).send(err);
    }

});

//Login 
router.post('/login', async (req, res) => {
    //validate the request
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check if the email exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email is not found.');
    
    // check if the password is correct or not
    const validPass = bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).status('Invalid Password.')
    try {
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
        res.header('auth-token', token).send(token);
    } catch { 
        res.status(400).send(err);
    }
});

// Read all
router.get('/all', verify, async (req, res) => {
    const token = req.header('auth-token');
    const decodedToken = jwt_decode(token);
    const verified_user = await User.find({ "_id": ObjectId(decodedToken._id) });
    // admin
    if(verified_user[0].user_role==="admin"){ 
        const userData = await User.find({ "status": true });
        try {
            res.send(userData);
        } catch(err) { 
            res.status(400).send(err);
        }
    }

    // doctor
    if(verified_user[0].user_role==="doctor"){ 
        const userData = await User.find({ "user_role": "doctor" });
        try {
            res.send(userData);
        } catch(err) { 
            res.status(400).send(err);
        }
    }

    // staff
    if(verified_user[0].user_role==="staff"){ 
        const userData = await User.find({ "user_role": "staff" });
        try {
            res.send(userData);
        } catch(err) { 
            res.status(400).send(err);
        }
    }

    // nurse
    if(verified_user[0].user_role==="nurse"){ 
        const userData = await User.find({ "user_role": "nurse" });
        try {
            res.send(userData);
        } catch(err) { 
            res.status(400).send(err);
        }
    }
});

// Read one
router.get('/:id', verify, async (req, res) => {
    const token = req.header('auth-token');
    const decodedToken = jwt_decode(token);
    const verified_user = await User.find({ "_id": ObjectId(decodedToken._id) });
    // admin
    if (verified_user[0].user_role === "doctor" || verified_user[0].user_role === "staff" || verified_user[0].user_role === "admin" || verified_user[0].user_role === "nurse") {
        const { id } = req.params;
        const user = await User.findOne({ "_id": id });
        if(!user) return res.status(400).send('User not found.');
        try {
            res.send(user);
        } catch(err) { 
            res.status(400).send(err);
        }
    }
});

// Update one
router.put('/:id', verify, async (req, res) => {
    const token = req.header('auth-token');
    const decodedToken = jwt_decode(token);
    const verified_user = await User.find({ "_id": ObjectId(decodedToken._id) });
    
    // admin
    if (verified_user[0].user_role==="doctor" || verified_user[0].user_role==="staff" || verified_user[0].user_role==="admin" || verified_user[0].user_role==="nurse") {
        const { id } = req.params;
        //validate the request
        const value = await req.body;
        const user = await User.findOne({ "_id": id });
        if(!user) return res.status(400).send('User not found.'); 
        try {
            const updated = await User.update({
                _id: id,
            }, {$set: value});
            res.send(value);
        } catch(err) { 
            res.status(400).send(err);
        }
    }
});


// Delete one
router.delete('/:id', verify, async (req, res) => {
    const token = req.header('auth-token');
    const decodedToken = jwt_decode(token);
    const verified_user = await User.find({ "_id": ObjectId(decodedToken._id) });
    // admin
    if (verified_user[0].user_role==="doctor" || verified_user[0].user_role==="staff" || verified_user[0].user_role==="admin" || verified_user[0].user_role==="nurse") {
        const { id } = req.params;
        const user = await User.findOne({ "_id": id });
        if(!user) return res.status(400).send('User not found.');
        try {
            const deleted = await User.remove({
                _id: id
            });
            res.send("User deleted sucessfully.");
        } catch(err) { 
            res.status(400).send(err);
        }
    }
});

//Logout 
router.post('/logout', async (req, res) => {
    //validate the request
    console.log('Delete the token');
});
module.exports = router;
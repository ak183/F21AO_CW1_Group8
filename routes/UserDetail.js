const router = require('express').Router();
const verify = require('./verifyToken');
const UserDetail = require('../model/UserDetail');
const User = require('../model/User');
const jwt_decode = require('jwt-decode');
const { userRegisterValidation } = require('../validation/userValidation');
const ObjectId = require('mongodb').ObjectID;

router.post('/registration', verify, async (req, res) => {
    const token = req.header('auth-token');
    const decodedToken = jwt_decode(token);
    const verified_user = await User.find({ "_id": ObjectId(decodedToken._id) });
    // doctor, staff, nurse, admin can fill in their personal details
    if(verified_user[0].user_role==="doctor" || verified_user[0].user_role==="staff" || verified_user[0].user_role==="admin"|| verified_user[0].user_role==="nurse"){ 
        const {error} = userRegisterValidation(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        // create a new user
        const details = new UserDetail({
            _id: decodedToken._id,
            age: req.body.age,
            gender: req.body.gender,
            department: req.body.department,
            marital_status: req.body.marital_status,
            phone: req.body.phone,
            country: req.body.country,
            emirate: req.body.emirate,
            address: req.body.address
        });
        try {
            const savedDetails = await details.save();
            res.send('Details Save Sucessfully.');
        }
        catch(err) { 
            res.status(400).send(err.keyValue._id + ' has already registered details' );
        }
    } else {
        res.status(400).send('You cannot fill in this details.');
    }
});

// Read all
router.get('/all', verify, async (req, res) => {
    const token = req.header('auth-token');
    const decodedToken = jwt_decode(token);
    const verified_user = await User.find({ "_id": ObjectId(decodedToken._id) });
    // admin
    if (verified_user[0].user_role === "admin") {
        const userData = await UserDetail.find();
        try {
            res.send(userData);
        } catch (err) {
            res.status(400).send(err);
        }
    } else { 
        res.status(400).send('Access Denied!'); 
    }
});

// Read one
router.get('/:id', verify, async (req, res) => {
    const token = req.header('auth-token');
    const decodedToken = jwt_decode(token);
    const verified_user = await User.find({ "_id": ObjectId(decodedToken._id) });
    const { id } = req.params;
    // admin
    if (id === decodedToken._id || verified_user[0].user_role==="admin") {
        if (verified_user[0].user_role === "doctor" || verified_user[0].user_role === "staff" || verified_user[0].user_role === "admin" || verified_user[0].user_role === "nurse") {
            const user = await UserDetail.findOne({ "_id": id });
            if(!user) return res.status(400).send('User not found.');
            try {
                res.send(user);
            } catch(err) { 
                res.status(400).send(err);
            }
        }
    } else { 
        res.status(400).send('Access Denied!');  
    } 
});

// Update one
router.put('/:id', verify, async (req, res) => {
    const token = req.header('auth-token');
    const decodedToken = jwt_decode(token);
    const verified_user = await User.find({ "_id": ObjectId(decodedToken._id) });
    const { id } = req.params;
    if (id === decodedToken._id || verified_user[0].user_role==="admin") {
        // admin
        if (verified_user[0].user_role==="doctor" || verified_user[0].user_role==="staff" || verified_user[0].user_role==="admin" || verified_user[0].user_role==="nurse") {
            //validate the request
            const value = await req.body;
            const userDetailData = await UserDetail.findOne({ "_id": id });
            if(!userDetailData) return res.status(400).send('User not found.'); 
            try {
                const updated = await UserDetail.update({
                    _id: id,
                }, {$set: value});
                res.send(value);
            } catch(err) { 
                res.status(400).send(err);
            }
        }
    } else { 
        res.status(400).send('Access Denied!');  
    } 
});


// Delete one
router.delete('/:id', verify, async (req, res) => {
    const token = req.header('auth-token');
    const decodedToken = jwt_decode(token);
    const verified_user = await User.find({ "_id": ObjectId(decodedToken._id) });
    const { id } = req.params;
    if (id === decodedToken._id || verified_user[0].user_role === "admin") {
        // admin
        if (verified_user[0].user_role === "doctor"
            || verified_user[0].user_role === "staff"
            || verified_user[0].user_role === "admin"
            || verified_user[0].user_role === "nurse") {
            const user = await UserDetail.findOne({ "_id": id });
            if (!user) return res.status(400).send('User not found.');
            try {
                const deleted = await UserDetail.remove({
                    _id: id
                });
                res.send("User deleted sucessfully.");
            } catch (err) {
                res.status(400).send(err);
            }
        }
    } else { 
        res.status(400).send('Access Denied!');
    }
});

module.exports = router;
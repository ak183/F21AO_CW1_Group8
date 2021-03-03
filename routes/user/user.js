const router = require('express').Router(); 
const user = require('../../model/Users_schema');
const validation = require('../../validation/userinputvalidation');
const {checkadmin} = require('../../middleware/User_check');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const dotenv = require('dotenv');

//All Modules for routes

dotenv.config();

//console.log(shortid.generate());
/* ------Register USER -------
---------------------------- */
router.post('/register',async(req,res)=>{

    console.log('executin route');
    console.log(req.body);

    const {error}=validation.createuservalidation(req.body)
    if(error) return res.send({"error":error.details[0].message})

    if(req.body.user_role==="admin"){
        const checkadmin = await user.find({ "user_role": "admin","status":true})
    if(await checkadmin.length>=2){return res.send({"error":"Cannot create more than 2 administrators"})}
    }
        const salt = await bcrypt.genSalt(10);
        const hashedpassword= await bcrypt.hash(req.body.password,salt)
        const random_id = 1234;


        const newuser = new user({
            staff_id:random_id,
            first_name:req.body.first_name,
            last_name:req.body.last_name,
            user_name:req.body.user_name,
            user_role:req.body.user_role,
            phoneno:req.body.phoneno,
            email:req.body.email,
            address:req.body.address,
            password:hashedpassword
        })

        const isuser = await user.findOne({"user_name":req.body.user_name,"status":true})
        if(isuser){return res.send({"error":"This user is already saved"})}
        if(!isuser){
            const savednewuser = await newuser.save();
            res.send(`User Added with StaffID ${random_id}`);
        }
        

        
})


/* ------LOGIN USER --------
---------------------------- */
router.post('/login',async(req,res)=>{
    console.log("userlogging")

    const {error}=validation.userloginvalidation(req.body)
    if(error) return res.send({"error":error.details[0].message})

    const usernameexist =await user.findOne({"user_name" : req.body.user_name,"status":true})
    if(!usernameexist) return res.send({"error":"This user does not exist"})

    async function checkpassword(){
        dbpassword= await usernameexist.password
        const validpassword = bcrypt.compareSync(req.body.password, await dbpassword)
        if(!validpassword) return(false); return(true);
    }

    if(usernameexist && await checkpassword()){
        console.log('User Logging in...wait')
        token=jwt.sign({id:usernameexist._id,role:usernameexist.role},process.env.jwt_master_secret);
        res.send({"success":await token,"role":usernameexist.user_role,"name":usernameexist.user_name,})
    }else return res.send({"error":"Wrong password"})
})



/* ------CHANGE USER DATA------
---------------------------- */
router.post('/updateuser',checkadmin,async(req,res)=>{
    //sending user_id from frontend is must

    const {error}=validation.changeuservalidation(req.body)
    if(error) return res.send({"error":error.details[0].message})

    const finduser=await user.findOne({"user_name":req.body.user_name})
    if(finduser.user_role==='admin' && req.body.user_role!="admin"){
    const checkadmin= await user.find({"user_role":"admin","status":true})
    if(checkadmin.length>=2){return res.send({"error":"Cannot create more than 2 administrators"})}
    else if(checkadmin.length===1){return res.send({"error":"Atleast one administrator is required"})}}
    else{
        const usernameexist =await user.findOne({"user_name" : req.body.user_name,"status":true})
        console.log(usernameexist);
        if(usernameexist){
            try{
                const newdata= await user.findOneAndUpdate({"user_name":req.body.user_name},{
                    "first_name":req.body.first_name,
                    "last_name":req.body.last_name,
                    "user_role":req.body.user_role,
                    "phoneno":req.body.phoneno,
                    "email":req.body.email,
                    "address":req.body.address,
                },{useFindAndModify:false,new:true})
                if(await newdata ){return res.send({"success":"updated successfully","newdata":newdata})}else{/* redirect to error page */ return res.send({"error":"Error saving to database"})}
            }catch {err=>{ return res.send({"error":"No such user found"})}}
        }else{return res.send({"error":"Another user with same details found"})}
    }
})


//checkadmin,
/* ------GET USER DATA ------
---------------------------- */
router.post('/getdata',checkadmin,async(req,res)=>{
    console.log(req.body.user_name);
    const {error}=validation.usergetdatavalidation(req.body)
    if(error) return res.send({"error":error.details[0].message})
    

    // send username or phonenumber from frontend
    if(req.body.user_name!=undefined && req.body.staff_id!=undefined){
        const datas = await user.find({"user_name":req.body.user_name,"staff_id":req.body.staff_id,"status":true})
        if(datas){return res.send({"success":datas})}else{return res.send({"error":"No such user found"})}
    }
    if(req.body.user_name!=undefined && req.body.staff_id ===undefined){
        const datas = await user.find({"user_name":req.body.user_name,"status":true})
        if(datas){return res.send({"success":datas})}else{return res.send({"error":"No such user found"})}
    }
    if(req.body.user_name ===undefined && req.body.staff_id !==undefined){
        const datas = await user.find({"staff_id":req.body.staff_id,"status":true})
        if(datas){return res.send({"success":datas})}else{return res.send({"error":"No such user found"})}
    }
    else{
        const datas = await user.find({"status":true})
        if(datas){return res.send({"success":datas})}else{return res.send({"error":"No such user found"})}
    }

})


/* ------CHANGE USER PASSWORD BY ADMIN-----
---------------------------------- */
router.post('/updatepassword',checkadmin,async(req,res)=>{

    const {error}=validation.changeuserpasswordvalidation(req.body)
    if(error) return res.send({"error":error.details[0].message})


    //sending user_id and password from frontend is must
    const salt = await bcrypt.genSalt(10);
    const hashedpassword= await bcrypt.hash(req.body.password,salt)
    try{
        const newdata= await user.findOneAndUpdate({"user_name":req.body.user_name,"status":true},{
            "password":hashedpassword
        },{useFindAndModify:false,new:true})
        if(await newdata){return res.send({"success":"Changed password"})}else{/* redirect to error page */ return res.send({"error":"Error saving to database"})}
    }catch{err=>{ return res.send({"error":"No such user found"})}}
})


/* ------DELETE USER by Admin-------------
---------------------------------- */
router.post('/deleteuser',checkadmin,async(req,res)=>{

    const {error}=validation.deleteuservalidation(req.body)
    if(error) return res.send({"error":error.details[0].message})

    const finduser=await user.findOne({"user_name":req.body.user_name})
    if(finduser.user_role==='admin'){
        const checkadmin= await user.find({"user_role":"admin","status":true})
        if(checkadmin.length===1){return res.send({"error":"Atleast one administrator is required"})}
        else{
            try{
                const deleteuser= await user.findOneAndUpdate({"user_name":req.body.user_name,"status":true},{
                    "status":false
                },{useFindAndModify:false,new:true})
                if(await deleteuser){return res.send({"success":"Deleted user"})}else{/* redirect to error page */ return res.send({"error":"Error deleting user from database"})}
            }catch{err=>{ return res.send({"error":"No such user found"})}}
        }
    }else{
    try{
            const deleteuser= await user.findOneAndUpdate({"user_name":req.body.user_name,"status":true},{
                "status":false
            },{useFindAndModify:false,new:true})
            if(await deleteuser){return res.send({"success":"Deleted user"})}else{/* redirect to error page */ return res.send({"error":"Error deleting user from database"})}
        }catch{err=>{ return res.send({"error":"No such user found"})}}
    }
})

//Get Calls for the Staff Memebers. Only user with "admin" privilages can fetch the details. 


router.post('/getallstaff',checkadmin,async(req,res)=>{   
    try{
    const list=[];
    const datas = await user.find({"status":true},{"user_name":1,"user_role":1,"_id":0})
    if(datas.length>0){return res.send({"success":datas})}else{return res.send({"error":"No doctors found"})}
    }catch{err=>{console.log(err)}}
})

router.post('/getalldoctors',checkadmin,async(req,res)=>{   
    try{
    const list=[];
    const datas = await user.find({"status":true,"user_role":"doctor"},{"user_name":1,"user_role":1,"_id":0})
    if(datas.length>0){return res.send({"success":datas})}else{return res.send({"error":"No doctors found"})}
    }catch{err=>{console.log(err)}}
})

router.post('/getallnurses',checkadmin,async(req,res)=>{   
    try{
    const list=[];
    const datas = await user.find({"status":true,"user_role":"nurse"},{"user_name":1,"user_role":1,"_id":0})
    if(datas.length>0){return res.send({"success":datas})}else{return res.send({"error":"No doctors found"})}
    }catch{err=>{console.log(err)}}
})


module.exports=router;
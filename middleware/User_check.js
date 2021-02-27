//All user level Checks before user performs any action happens here.
const user = require('../model/Users_schema')
const jwt=require('jsonwebtoken')
const dotenv=require('dotenv')
dotenv.config();



async function checkadmin(req,res,next){
    const admin=["admin","hr"]
    try{
        const token=await req.get('Authorization').replace("Bearer ","")
        console.log(token);
        const payload=jwt.verify(await token,process.env.jwt_master_secret)
        console.log(payload);
/*------------redirect to error page--------------------- */
        try{const userdata =await user.findOne({"_id":await payload.id,"role":await payload.role,"status":true})
            if((admin.findIndex(x=>x===userdata.user_role)===-1))return res.send({"error":"User Does Not have the Authority"})
        }catch(err){return /*redirect to error page*/res.send({"error":"Other Error"})}
    }catch(err){return res.send({"error":err})}
/*------------redirect to error page--------------------- */

    next()
}

async function checkreception(req,res,next){
    const admin=["reception"]
    try{
        const token=await req.get('Authorization').replace("Bearer ","")
        console.log(token);
        const payload=jwt.verify(await token,process.env.jwt_master_secret)
/*------------redirect to error page--------------------- */
        try{const userdata =await user.findOne({"_id":await payload.id,"role":await payload.role,"status":true})
            if((admin.findIndex(x=>x===userdata.user_role)===-1))return res.send({"error":"User Does Not have the Authority"})
        }catch(err){return /*redirect to error page*/res.send({"error":"Other Error"})}
    }catch(err){return res.send({"error":err})}
/*------------redirect to error page--------------------- */   
    next()
}


async function checkdoctor(req,res,next){
    const admin=["doctor"]
    try{
        const token=await req.get('Authorization').replace("Bearer ","")
        console.log(token);
        const payload=jwt.verify(await token,process.env.jwt_master_secret)
/*------------redirect to error page--------------------- */
        try{const userdata =await user.findOne({"_id":await payload.id,"role":await payload.role,"status":true})
            if((admin.findIndex(x=>x===userdata.user_role)===-1))return res.send({"error":"User Does Not have the Authority"})
        }catch(err){return /*redirect to error page*/res.send({"error":"Other Error"})}
    }catch(err){return res.send({"error":err})}
/*------------redirect to error page--------------------- */   
    next()
}


async function checklabassitant(req,res,next){
    const admin=["labassistant"]
    try{
        const token=await req.get('Authorization').replace("Bearer ","")
        console.log(token);
        const payload=jwt.verify(await token,process.env.jwt_master_secret)
/*------------redirect to error page--------------------- */
        try{const userdata =await user.findOne({"_id":await payload.id,"role":await payload.role,"status":true})
            if((admin.findIndex(x=>x===userdata.user_role)===-1))return res.send({"error":"User Does Not have the Authority"})
        }catch(err){return /*redirect to error page*/res.send({"error":"Other Error"})}
    }catch(err){return res.send({"error":err})}
/*------------redirect to error page--------------------- */   
    next()
}


async function checknursingstaff(req,res,next){
    const admin=["nurse"]
    try{
        const token=await req.get('Authorization').replace("Bearer ","")
        console.log(token);
        const payload=jwt.verify(await token,process.env.jwt_master_secret)
/*------------redirect to error page--------------------- */
        try{const userdata =await user.findOne({"_id":await payload.id,"role":await payload.role,"status":true})
            if((admin.findIndex(x=>x===userdata.user_role)===-1))return res.send({"error":"User Does Not have the Authority"})
        }catch(err){return /*redirect to error page*/res.send({"error":"Other Error"})}
    }catch(err){return res.send({"error":err})}
/*------------redirect to error page--------------------- */   
    next()
}

module.exports={checkadmin,checkreception,checkdoctor,checklabassitant,checknursingstaff}
const mongoose= require('mongoose')


//Here the Role will have values like "Admin", "Operation", "Medical"
const Users= new mongoose.Schema({
    status:{type:Boolean,default:true,required:true},
    staff_id:{type:Number},
    user_name:{type:String,required:true,lowercase:true},
    user_role:{type:String,required:true,lowercase:true},
    password:{type:String,required:true},
})

module.exports=mongoose.model('user',Users)
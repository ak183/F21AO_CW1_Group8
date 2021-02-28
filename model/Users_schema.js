const mongoose= require('mongoose')


//Here the Role will have values like "Admin", "Operation", "Medical"
const Users= new mongoose.Schema({
    status:{type:Boolean,default:true,required:true},
    first_name:{type:String,required:true},
    last_name:{type:String,required:true},
    user_name:{type:String,required:true,lowercase:true},
    user_role:{type:String,required:true,lowercase:true},
    password:{type:String,required:true},
    phoneno:{type:String,required:true},
    email:{type:String,lowercase:true},
    address:{type:String,required:true},
})

module.exports=mongoose.model('user',Users)
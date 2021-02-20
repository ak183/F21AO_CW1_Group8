const mongoose= require('mongoose')

const Users= new mongoose.Schema({
    status:{type:Boolean,default:true,required:true},
    staff_id:{type:Number, ref: 'User'},
    designition:{type:String,required:true,lowercase:true},
    phoneno:{type:String,required:true},
    email:{type:String,lowercase:true},
    address:{type:String,required:true},
    dept:{type:String,required:true},
    join_date:{type:String},
})

module.exports=mongoose.model('user',Users)
import mongoose from "mongoose";

const itemSchema=new mongoose.Schema({
    itemName:{type:String,required:true},
    itemValue:{type:Number, required:true},
    weight:{type:Number},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    assignedStatus:{type:Boolean,default:false}
},{timestamps:true})


const Items=mongoose.model("Items",itemSchema);

export default Items;
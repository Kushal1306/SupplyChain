import mongoose from "mongoose";

const assignmentsSchema=new mongoose.Schema({
    itemId:{type:mongoose.Schema.Types.ObjectId, ref:'Items'},
    vehicleId:{type:mongoose.Schema.Types.ObjectId,ref:'Vehicles'},
    assignedAt: { type: Date, default: Date.now },
},{timestamps:true});


const Assignments=mongoose.model("Assignments",assignmentsSchema);

export default Assignments;
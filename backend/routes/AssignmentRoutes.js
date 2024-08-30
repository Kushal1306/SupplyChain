import express from 'express';
import Assignments from "../models/Assignments.js";
import Vehicles from '../models/Vehicles.js';
import Items from '../models/Items.js';

const assignmentRoute=express.Router();

assignmentRoute.post("/",async(req,res)=>{
    
    try {
        const {vehicleId,itemId}=req.body;

        const [vehicle, item] = await Promise.all([
            Vehicles.findById(vehicleId),
            Items.findById(itemId)
        ]);

        if (!vehicle || !item) {
            return res.status(404).json({ message: 'Vehicle or Item not found' });
        }
        
        // checking if capacity is reached
        if(vehicle.assignedItems.length>=vehicle.capacity){
            return res.status(400).json({
                message:'vehicle capacity reached'
            })
        }

        // checking if item is already assigned so that we xan update it
        if(item.assignedStatus){
            const assignment=await Assignments.findOne({itemId});
            if(assignment){
                assignment.vehicleId=vehicleId;
                assignment.assignedAt=new Date();
                vehicle.assignedItems.push({itemId,assignedAt:new Date()})

                await Promise.all([
                    assignment.save(),
                    vehicle.save()
                ]);
            }
            return res.status(200).json({ message: 'Item assignment updated', vehicle });

    
        } // if item is not assigned
        else{
            const newAssignment=new Assignments({
                vehicleId,
                itemId,
                assignedAt:new Date()
            });

            vehicle.assignedItems.push({itemId,assign:new Date()});

            item.assignedStatus=true;

            await Promise.all([
                newAssignment.save(),
                vehicle.save(),
                item.save()
            ]);

            res.status(201).json({
                message:'item assigned'
            });

           
        }
        
    } catch (error) {
       console.log(error);
       res.status(500).json({message:'error'});
    }

});



export default assignmentRoute;

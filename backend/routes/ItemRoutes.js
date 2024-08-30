import express from 'express';
import Items from '../models/Items.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const itemRoute=express.Router();

itemRoute.post("/",authMiddleware,async(req,res)=>{
    try {
    
        const { itemName, itemValue, weight} = req.body;
        const userId=req.userId;

        const newItem = new Items({
            itemName,
            itemValue,
            weight,
            userId
        });
        const savedItem = await newItem.save();

        if(!savedItem)
            res.status(400).json({
        Message:'error occured'});

        res.status(201).json(savedItem);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }

});

itemRoute.get("/all",async(req,res)=>{
    try {
        const items = await Items.find();

        if(!items)
            return res.status(400).send({message:'no items found'});
        return res.status(200).json({
            items:items
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message:'error', error });
    }
});


itemRoute.get("/",async(req,res)=>{
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({ message: 'userid is required' });
        }
        const items = await Items.find({ userId });

        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'error occured', error });
    }
});


itemRoute.get("/user/:userId",async(req,res)=>{
    try {
        const { userId } = req.params;
        const userItems = await Items.find({ userId });

        if (userItems.length === 0) {
            return res.status(404).json({ message: 'No items found for this user' });
        }

        res.status(200).json(userItems);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'error', error });
    }
});


export default itemRoute;
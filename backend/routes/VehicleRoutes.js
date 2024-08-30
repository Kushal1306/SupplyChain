import express from 'express';
import Vehicles from '../models/Vehicles.js';

const vehicleRoute = express.Router();

vehicleRoute.post("/", async (req, res) => {
    try {
        const { vehicleNumber, capacity} = req.body;

        const newVehicle = new Vehicles({
            vehicleNumber,
            capacity
    });
        const saveVehicle = await newVehicle.save();
        res.status(201).json(saveVehicle);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'error occured', error });
    }
});


vehicleRoute.get('/', async (req, res) => {
    try {
      const vehicles = await Vehicles.find();
      res.status(200).json({vehicles:vehicles});
    } catch (error) {
      res.status(500).json({ message: 'Error fetching vehicles', error });
    }
  });

  vehicleRoute.get('/:vehicleId/items', async (req, res) => {
    try {
        const { vehicleId } = req.params;
        const vehicle = await Vehicles.findById(vehicleId).populate('assignedItems.itemId');
        
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        const assignedItems = vehicle.assignedItems.map(assignment => ({
            ...assignment.itemId.toObject(),
            assignedAt: assignment.assignedAt
        }));

        res.status(200).json({ items: assignedItems });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching vehicle items', error });
    }
});
export default vehicleRoute;

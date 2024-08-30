import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    vehicleNumber: { type: String, required: true },
    capacity: { type: Number },
    assignedItems: [{
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Items' },
        assignedAt: { type: Date, default: Date.now }
    }
    ],
}, { timestamps: true });

const Vehicles=mongoose.model("Vehicles",vehicleSchema);

export default Vehicles;
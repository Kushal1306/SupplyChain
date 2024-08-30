import express from 'express';
import UserRoute from './UserRoutes.js';
import itemRoute from './itemRoutes.js';
import vehicleRoute from './VehicleRoutes.js';
import assignmentRoute from './AssignmentRoutes.js';

const mainRouter=express.Router();

mainRouter.use("/user",UserRoute);
mainRouter.use("/items",itemRoute);
mainRouter.use("/vehicle",vehicleRoute);
mainRouter.use("/assignment",assignmentRoute);



export default mainRouter;
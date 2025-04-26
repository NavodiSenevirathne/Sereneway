// routes/driverRoutes.js
import express from 'express';
import { addDriver, getDrivers, getDriverById, updateDriver, deleteDriver } from '../controllers/driverController.js';

const router = express.Router();

router.post('/', addDriver);
router.get('/', getDrivers);
router.get('/:id', getDriverById);
router.put('/:id', updateDriver);
router.delete('/:id', deleteDriver);

export default router;

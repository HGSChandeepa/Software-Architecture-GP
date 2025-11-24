import { Router } from 'express';
import { StallController } from './controllers/StallController';
import { StallService } from './services/StallService';
import { StallRepository } from './repositories/StallRepository';

const router = Router();
const stallRepository = new StallRepository();
const stallService = new StallService(stallRepository);
const stallController = new StallController(stallService);

router.get('/', stallController.getAllStalls);
router.get('/available', stallController.getAvailableStalls);
router.get('/:id', stallController.getStallById);

export default router;
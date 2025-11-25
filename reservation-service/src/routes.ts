import { Router } from 'express';
import { ReservationController } from './controllers/ReservationController';
import { ReservationService } from './services/ReservationService';
import { ReservationRepository } from './repositories/ReservationRepository';
import { authenticateToken } from './middleware/auth';

const router = Router();
const reservationRepository = new ReservationRepository();
const reservationService = new ReservationService(reservationRepository);
const reservationController = new ReservationController(reservationService);

router.use(authenticateToken);

router.post('/reserve', reservationController.createReservation);
router.get('/my-reservations', reservationController.getMyReservations);
router.get('/all', reservationController.getAllReservations);

export default router;
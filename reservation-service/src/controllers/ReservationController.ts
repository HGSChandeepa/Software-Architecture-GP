import { Request, Response } from 'express';
import { ReservationService } from '../services/ReservationService';
import { AuthRequest } from '../middleware/auth';

export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  createReservation = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user.userId;
      const { stallIds } = req.body; // Array of stall IDs

      if (!Array.isArray(stallIds) || stallIds.length === 0) {
        return res.status(400).json({ error: 'stallIds must be a non-empty array' });
      }

      if (stallIds.length > 3) {
        return res.status(400).json({ error: 'Cannot reserve more than 3 stalls at once' });
      }

      const reservations = await this.reservationService.createReservation(userId, stallIds, req.user.email);
      res.status(201).json(reservations);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getMyReservations = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user.userId;
      const reservations = await this.reservationService.getUserReservations(userId);
      res.json(reservations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getAllReservations = async (req: AuthRequest, res: Response) => {
    try {
      // Only allow employees to view all reservations
      if (req.user.role !== 'EMPLOYEE') {
        return res.status(403).json({ error: 'Access denied. Employees only.' });
      }

      const reservations = await this.reservationService.getAllReservations();
      res.json(reservations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
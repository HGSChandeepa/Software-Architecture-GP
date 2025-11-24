import { Request, Response } from 'express';
import { StallService } from '../services/StallService';

export class StallController {
  constructor(private stallService: StallService) {}

  getAllStalls = async (req: Request, res: Response) => {
    try {
      const stalls = await this.stallService.getAllStalls();
      res.json(stalls);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getAvailableStalls = async (req: Request, res: Response) => {
    try {
      const stalls = await this.stallService.getAvailableStalls();
      res.json(stalls);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getStallById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const stall = await this.stallService.getStallById(id);
      
      if (!stall) {
        return res.status(404).json({ error: 'Stall not found' });
      }
      
      res.json(stall);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
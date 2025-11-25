import { pool } from '../database';

export interface Reservation {
  id: number;
  user_id: number;
  stall_id: number;
  qr_code: string;
  status: string;
  created_at: Date;
}

export class ReservationRepository {
  async create(userId: number, stallId: number, qrCode: string): Promise<Reservation> {
    const result = await pool.query(
      'INSERT INTO reservations (user_id, stall_id, qr_code) VALUES ($1, $2, $3) RETURNING *',
      [userId, stallId, qrCode]
    );
    return result.rows[0];
  }

  async findByUserId(userId: number): Promise<Reservation[]> {
    const result = await pool.query(
      `SELECT r.*, s.stall_code, s.size, s.price
       FROM reservations r
       JOIN stalls s ON r.stall_id = s.id
       WHERE r.user_id = $1 AND r.status = 'confirmed'
       ORDER BY r.created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  async findAll(): Promise<any[]> {
    const result = await pool.query(
      `SELECT r.*, s.stall_code, s.size, u.name as vendor_name, u.email as vendor_email
       FROM reservations r
       JOIN stalls s ON r.stall_id = s.id
       JOIN users u ON r.user_id = u.id
       WHERE r.status = 'confirmed'
       ORDER BY r.created_at DESC`
    );
    return result.rows;
  }

  async countUserReservations(userId: number): Promise<number> {
    const result = await pool.query(
      'SELECT COUNT(*) FROM reservations WHERE user_id = $1 AND status = $2',
      [userId, 'confirmed']
    );
    return parseInt(result.rows[0].count);
  }

  async exists(userId: number, stallId: number): Promise<boolean> {
    const result = await pool.query(
      'SELECT 1 FROM reservations WHERE user_id = $1 AND stall_id = $2 AND status = $3',
      [userId, stallId, 'confirmed']
    );
    return result.rows.length > 0;
  }
}
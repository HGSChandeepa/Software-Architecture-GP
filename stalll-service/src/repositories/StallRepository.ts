import { pool } from '../database';

export interface Stall {
  id: number;
  stall_code: string;
  size: string;
  is_reserved: boolean;
  price: number;
}

export class StallRepository {
  async findAll(): Promise<Stall[]> {
    const result = await pool.query(
      'SELECT id, stall_code, size, is_reserved, price FROM stalls ORDER BY stall_code'
    );
    return result.rows;
  }

  async findAvailable(): Promise<Stall[]> {
    const result = await pool.query(
      'SELECT id, stall_code, size, is_reserved, price FROM stalls WHERE is_reserved = false ORDER BY stall_code'
    );
    return result.rows;
  }

  async findById(id: number): Promise<Stall | null> {
    const result = await pool.query(
      'SELECT id, stall_code, size, is_reserved, price FROM stalls WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async markAsReserved(id: number): Promise<void> {
    await pool.query('UPDATE stalls SET is_reserved = true WHERE id = $1', [id]);
  }

  async markAsAvailable(id: number): Promise<void> {
    await pool.query('UPDATE stalls SET is_reserved = false WHERE id = $1', [id]);
  }
}